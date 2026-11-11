import { Router } from 'express';
import multer from 'multer';
import { createHash, randomUUID } from 'node:crypto';
import { z } from 'zod';
import { supabase } from '../config/supabase.js';
import { env } from '../config/env.js';
import { requireOrgMember, requireProjectMember, requireManager } from '../services/access.js';
import { filterFindingsForRole, filterSourcesForRole } from '../services/sourceAccess.js';
import type { AuthedRequest } from '../types.js';

export const api = Router();
// Express 4 does not forward rejected async route promises to error middleware.
// Wrap registered route handlers once so unexpected async failures reach errorHandler.
for (const method of ['get', 'post', 'put', 'patch', 'delete'] as const) {
  const original = (api as any)[method].bind(api);
  (api as any)[method] = (path: string, ...handlers: any[]) => original(path, ...handlers.map((handler: any) => (req: any, res: any, next: any) => {
    try {
      const result = handler(req, res, next);
      if (result && typeof result.then === 'function') result.catch(next);
    } catch (error) { next(error); }
  }));
}
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: env.MAX_UPLOAD_MB * 1024 * 1024 }, fileFilter: (_req, file, cb) => {
  const allowed = ['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  cb(allowed.includes(file.mimetype) ? null : new Error('Only PDF and DOCX files are supported.'), allowed.includes(file.mimetype));
} });
const projectInput = z.object({ organizationId: z.string().uuid(), name: z.string().trim().min(2).max(255), key: z.string().trim().min(2).max(50).regex(/^[A-Za-z0-9_-]+$/), description: z.string().max(3000).optional() });
const orgInput = z.object({ name: z.string().trim().min(2).max(255) });
const handoverInput = z.object({ projectId: z.string().uuid(), departingUserId: z.string().uuid(), targetUserId: z.string().uuid(), targetRoleId: z.string().uuid(), title: z.string().trim().min(3).max(255), description: z.string().max(3000).optional() });
const uid = (req: AuthedRequest) => req.user!.id;
const fail = (res: any, error: any) => res.status(error.statusCode || 500).json({ error: error.statusCode ? error.message : 'Request could not be completed.' });

api.get('/me', async (req: AuthedRequest, res) => {
  const userId = uid(req);
  const { data, error } = await supabase.from('user_profiles').select('id,email,full_name,avatar_url').eq('id', userId).single();
  if (error) return fail(res, error);
  const { data: incoming } = await supabase.from('handovers').select('id').eq('target_user_id', userId).in('status', ['GENERATING','IN_REVIEW','APPROVED','COMPLETED']).limit(1).maybeSingle();
  const { data: departing } = await supabase.from('handovers').select('id').eq('departing_user_id', userId).in('status', ['GENERATING','IN_REVIEW','APPROVED','COMPLETED']).limit(1).maybeSingle();
  const { data: memberships } = await supabase.from('project_members').select('project_roles(name),projects(organization_id,organizations(name))').eq('user_id', userId).eq('is_active', true).limit(1);
  const { data: orgMemberships } = await supabase.from('organization_members').select('role,organizations(name)').eq('user_id', userId).limit(1);
  const rawRoleName = (memberships?.[0] as any)?.project_roles?.name || (orgMemberships?.[0] as any)?.role || 'Member';
  const roleName = String(rawRoleName).toUpperCase() === 'OWNER' ? 'Project Manager' : String(rawRoleName).toUpperCase() === 'ADMIN' ? 'Administrator' : rawRoleName;
  const orgRole = String((orgMemberships?.[0] as any)?.role || '').toUpperCase();
  const isManager = ['MANAGER','OWNER','ADMIN','PROJECT MANAGER'].includes(String(roleName).toUpperCase()) || ['OWNER','ADMIN'].includes(orgRole);
  const perspective = incoming ? 'incoming' : departing ? 'departing' : (isManager ? 'manager' : 'member');
  const organization = (orgMemberships?.[0] as any)?.organizations?.name || (memberships?.[0] as any)?.projects?.organizations?.name || 'Your workspace';
  res.json({ user: { ...data, role: roleName, perspective, organization } });
});
api.get('/organizations', async (req: AuthedRequest, res) => {
  const { data, error } = await supabase.from('organization_members').select('role,organizations(id,name,slug,created_at)').eq('user_id', uid(req));
  if (error) return fail(res, error); res.json({ organizations: data || [] });
});
api.post('/organizations', async (req: AuthedRequest, res) => {
  const parsed = orgInput.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'Organisation name is required.' });
  const slug = `${parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').slice(0,70)}-${randomUUID().slice(0,6)}`;
  const { data: org, error } = await supabase.from('organizations').insert({ name: parsed.data.name, slug, created_by: uid(req) }).select().single();
  if (error) return fail(res, error);
  const { error: memberError } = await supabase.from('organization_members').insert({ organization_id: org.id, user_id: uid(req), role: 'OWNER' });
  if (memberError) return fail(res, memberError);
  res.status(201).json({ organization: org });
});
api.get('/organizations/:orgId/projects', async (req: AuthedRequest, res) => {
  try { await requireOrgMember(uid(req), req.params.orgId); } catch (e) { return fail(res,e); }
  const { data, error } = await supabase.from('projects').select('id,name,key,description,status,created_at,project_members(count),source_documents(count)').eq('organization_id', req.params.orgId).order('created_at',{ascending:false});
  if (error) return fail(res,error); res.json({ projects: data || [] });
});
api.post('/projects', async (req: AuthedRequest, res) => {
  const parsed = projectInput.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'Provide a valid organisation, project name and project key.' });
  try { await requireOrgMember(uid(req), parsed.data.organizationId); } catch(e) { return fail(res,e); }
  const { data: project, error } = await supabase.from('projects').insert({ organization_id: parsed.data.organizationId, name: parsed.data.name, key: parsed.data.key.toUpperCase(), description: parsed.data.description || null, created_by: uid(req) }).select().single();
  if (error) return fail(res,error);
  const roleRows = ['MANAGER','DEVELOPER','DESIGNER','MEMBER'].map(name => ({ project_id: project.id, name, is_system: true }));
  const { data: roles, error: roleError } = await supabase.from('project_roles').insert(roleRows).select('id,name');
  if (roleError) return fail(res,roleError);
  const managerRole = roles?.find(r => r.name === 'MANAGER');
  if (managerRole) { const { error: memberError } = await supabase.from('project_members').insert({ project_id: project.id, user_id: uid(req), role_id: managerRole.id }); if (memberError) return fail(res,memberError); }
  res.status(201).json({ project, roles });
});
api.get('/projects/:projectId', async (req: AuthedRequest, res) => {
  try { const { project } = await requireProjectMember(uid(req), req.params.projectId); res.json({ project }); } catch(e) { fail(res,e); }
});
api.get('/projects/:projectId/members', async (req: AuthedRequest, res) => {
  try { await requireProjectMember(uid(req), req.params.projectId); } catch(e) { return fail(res,e); }
  const { data, error } = await supabase.from('project_members').select('user_id,is_active,project_roles(name),user_profiles(id,email,full_name,avatar_url)').eq('project_id',req.params.projectId).eq('is_active',true);
  if (error) return fail(res,error); res.json({ members: data || [] });
});
api.post('/projects/:projectId/members', async (req: AuthedRequest, res) => {
  const parsed = z.object({ email: z.string().trim().email().max(255), roleId: z.string().uuid() }).safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Provide a valid team member email and project role.' });
  try {
    const project = await requireManager(uid(req), req.params.projectId);
    const { data: role, error: roleError } = await supabase.from('project_roles').select('id').eq('id', parsed.data.roleId).eq('project_id', req.params.projectId).maybeSingle();
    if (roleError) throw roleError;
    if (!role) return res.status(400).json({ error: 'Selected role does not belong to this project.' });
    const { data: profile, error: profileError } = await supabase.from('user_profiles').select('id,email,full_name,avatar_url').eq('email', parsed.data.email.toLowerCase()).maybeSingle();
    if (profileError) throw profileError;
    if (!profile) return res.status(404).json({ error: 'No KNOWFLOW account exists for this email. Ask the person to register first.' });
    const { data: orgMember, error: orgError } = await supabase.from('organization_members').select('id').eq('organization_id', project.organization_id).eq('user_id', profile.id).maybeSingle();
    if (orgError) throw orgError;
    if (!orgMember) {
      const { error: addOrgError } = await supabase.from('organization_members').insert({ organization_id: project.organization_id, user_id: profile.id, role: 'MEMBER' });
      if (addOrgError) throw addOrgError;
    }
    const { data: existing, error: existingError } = await supabase.from('project_members').select('id,is_active').eq('project_id', req.params.projectId).eq('user_id', profile.id).maybeSingle();
    if (existingError) throw existingError;
    if (existing?.is_active) return res.status(409).json({ error: 'This person is already an active project member.' });
    const query = existing
      ? supabase.from('project_members').update({ role_id: role.id, is_active: true }).eq('id', existing.id)
      : supabase.from('project_members').insert({ project_id: req.params.projectId, user_id: profile.id, role_id: role.id, is_active: true });
    const { data: member, error: memberError } = await query.select().single();
    if (memberError) throw memberError;
    res.status(201).json({ member: { ...member, user_profiles: profile } });
  } catch (error) { fail(res, error); }
});

api.get('/projects/:projectId/sources', async (req: AuthedRequest, res) => {
  let membership;try { ({membership}=await requireProjectMember(uid(req), req.params.projectId)); } catch(e) { return fail(res,e); }
  const { data, error } = await supabase.from('source_documents').select('id,filename,file_type,file_size_bytes,access_level,status,error_message,created_at').eq('project_id',req.params.projectId).order('created_at',{ascending:false});
  if (error) return fail(res,error);try{res.json({ sources: await filterSourcesForRole(req.params.projectId,membership.role_id,data||[]) });}catch(e){fail(res,e);}
});
api.post('/projects/:projectId/sources', upload.single('file'), async (req: AuthedRequest, res) => {
  let createdSourceId: string | undefined;
  if (!req.file) return res.status(400).json({ error: 'Choose a PDF or DOCX file.' });
  try {
    await requireManager(uid(req), req.params.projectId);
    const file = req.file; const ext = file.mimetype === 'application/pdf' ? 'pdf' : 'docx';
    const signatureOk = ext === 'pdf' ? file.buffer.subarray(0,5).toString('ascii') === '%PDF-' : file.buffer[0] === 0x50 && file.buffer[1] === 0x4b;
    if (!signatureOk) return res.status(415).json({error:'The uploaded file signature does not match its declared type.'});
    const checksum = createHash('sha256').update(file.buffer).digest('hex');
    const storagePath = `${req.params.projectId}/${randomUUID()}.${ext}`;
    const { error: storageError } = await supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).upload(storagePath,file.buffer,{contentType:file.mimetype,upsert:false});
    if (storageError) throw storageError;
    const { data: source, error } = await supabase.from('source_documents').insert({ project_id:req.params.projectId,uploaded_by:uid(req),filename:file.originalname,file_path:storagePath,file_type:ext.toUpperCase(),file_size_bytes:file.size,checksum_sha256:checksum,status:'PROCESSING',access_level:'INTERNAL' }).select().single();
    if (error) { await supabase.storage.from(env.SUPABASE_STORAGE_BUCKET).remove([storagePath]); throw error; }
    createdSourceId = source.id;
    const aiResponse = await fetch(`${env.AI_SERVICE_URL}/v1/extract`,{ method:'POST',headers:{'content-type':'application/json','x-knowflow-service-key':env.AI_SERVICE_API_KEY},body:JSON.stringify({ filename:file.originalname, contentBase64:file.buffer.toString('base64'), contentType:file.mimetype }) });
    if (!aiResponse.ok) throw new Error('AI extraction service failed.');
    const extracted = await aiResponse.json() as { chunks: Array<{content:string,page?:number}>; findings: Array<{category:string;classification:string;title:string;description:string;chunkIndex:number}> };
    const chunkRows = extracted.chunks.map((c,i)=>({project_id:req.params.projectId,source_document_id:source.id,chunk_index:i,content:c.content,page_number:c.page ?? null,file_path:file.originalname,metadata:{extractor:'knowflow-v1'}}));
    const { data: savedChunks, error: chunkError } = await supabase.from('document_chunks').insert(chunkRows).select('id,chunk_index,content,page_number');
    if (chunkError) throw chunkError;
    for (const finding of extracted.findings) {
      const { data: savedFinding, error: findingError } = await supabase.from('knowledge_findings').insert({ project_id:req.params.projectId,category:finding.category,classification:finding.classification,title:finding.title,description:finding.description,extracted_by:'KNOWFLOW_RULE_EXTRACTOR',metadata:{sourceDocumentId:source.id} }).select('id').single();
      if (findingError) throw findingError;
      const chunk = savedChunks?.find(c=>c.chunk_index===finding.chunkIndex);
      if (chunk) { const { error: evidenceError } = await supabase.from('evidence_references').insert({ project_id:req.params.projectId,finding_id:savedFinding.id,chunk_id:chunk.id,source_document_id:source.id,source_type:'DOCUMENT',source_title:file.originalname,file_path:file.originalname,page_number:chunk.page_number,snippet:chunk.content.slice(0,1800),context_summary:'Extracted directly from the uploaded source.' }); if (evidenceError) throw evidenceError; }
    }
    await supabase.from('source_documents').update({status:'INDEXED'}).eq('id',source.id);
    res.status(201).json({ source:{...source,status:'INDEXED'}, findingsCreated:extracted.findings.length, chunksCreated:extracted.chunks.length });
  } catch(e:any) {
    if (e.statusCode) return fail(res,e);
    console.error('Source ingestion failed:',e?.message);
    if (createdSourceId) await supabase.from('source_documents').update({ status: 'FAILED', error_message: 'Processing failed. Check the AI service and retry.' }).eq('id', createdSourceId);
    res.status(502).json({error:'Source was uploaded but processing did not complete. Check the AI service and retry.',details:env.NODE_ENV==='development'?e?.message:undefined});
  }
});
api.put('/projects/:projectId/sources/:sourceId/permissions', async (req: AuthedRequest,res)=>{
  const parsed=z.object({roleId:z.string().uuid(),canRead:z.boolean(),accessLevel:z.enum(['INTERNAL','RESTRICTED']).optional()}).safeParse(req.body);
  if(!parsed.success)return res.status(400).json({error:'Provide a valid project role and permission.'});
  try{await requireManager(uid(req),req.params.projectId);}catch(e){return fail(res,e);}
  const {data:source,error:sourceError}=await supabase.from('source_documents').select('id,access_level').eq('id',req.params.sourceId).eq('project_id',req.params.projectId).maybeSingle();
  if(sourceError)return fail(res,sourceError);if(!source)return res.status(404).json({error:'Source not found in this project.'});
  const {data:role,error:roleError}=await supabase.from('project_roles').select('id').eq('id',parsed.data.roleId).eq('project_id',req.params.projectId).maybeSingle();
  if(roleError)return fail(res,roleError);if(!role)return res.status(400).json({error:'Role does not belong to this project.'});
  if(parsed.data.accessLevel){const {error:accessError}=await supabase.from('source_documents').update({access_level:parsed.data.accessLevel}).eq('id',source.id).eq('project_id',req.params.projectId);if(accessError)return fail(res,accessError);}
  const {data:existing,error:lookupError}=await supabase.from('source_role_permissions').select('id').eq('source_document_id',source.id).eq('role_id',role.id).maybeSingle();
  if(lookupError)return fail(res,lookupError);
  const query=existing ? supabase.from('source_role_permissions').update({can_read:parsed.data.canRead}).eq('id',existing.id) : supabase.from('source_role_permissions').insert({project_id:req.params.projectId,source_document_id:source.id,role_id:role.id,can_read:parsed.data.canRead});
  const {data,error}=await query.select().single();if(error)return fail(res,error);res.json({permission:data});
});
api.get('/projects/:projectId/findings', async (req: AuthedRequest, res) => {
  let membership;try { ({membership}=await requireProjectMember(uid(req), req.params.projectId)); } catch(e) { return fail(res,e); }
  const { data, error } = await supabase.from('knowledge_findings').select('id,category,classification,title,description,status,metadata,created_at,evidence_references(id,source_document_id,github_source_id,source_title,file_path,page_number,snippet,is_source_deleted)').eq('project_id',req.params.projectId).neq('status','DISMISSED').order('created_at',{ascending:false});
  if (error) return fail(res,error);try{res.json({findings:await filterFindingsForRole(req.params.projectId,membership.role_id,data||[])});}catch(e){fail(res,e);}
});
api.patch('/findings/:findingId', async (req: AuthedRequest, res) => {
  const body = z.object({ status:z.enum(['ACTIVE','DISMISSED','VERIFIED']), title:z.string().min(2).max(500).optional(), description:z.string().min(2).optional() }).safeParse(req.body);
  if (!body.success) return res.status(400).json({error:'Invalid finding update.'});
  const { data: finding, error: readError } = await supabase.from('knowledge_findings').select('id,project_id').eq('id',req.params.findingId).single();
  if (readError) return fail(res,readError);
  try { await requireManager(uid(req),finding.project_id); } catch(e) { return fail(res,e); }
  const { data, error } = await supabase.from('knowledge_findings').update(body.data).eq('id',req.params.findingId).select().single();
  if (error) return fail(res,error); res.json({finding:data});
});
api.get('/projects/:projectId/roles', async (req: AuthedRequest, res) => {
  try { await requireProjectMember(uid(req),req.params.projectId); } catch(e) { return fail(res,e); }
  const {data,error}=await supabase.from('project_roles').select('id,name,description').eq('project_id',req.params.projectId);
  if(error)return fail(res,error);res.json({roles:data||[]});
});
api.post('/handovers', async (req: AuthedRequest, res) => {
  const parsed=handoverInput.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Complete all handover fields.'});
  try {
    await requireManager(uid(req),parsed.data.projectId);
    const {data:members,error:memberError}=await supabase.from('project_members').select('user_id').eq('project_id',parsed.data.projectId).eq('is_active',true).in('user_id',[parsed.data.departingUserId,parsed.data.targetUserId]);
    if(memberError)throw memberError;if(members?.length!==2) return res.status(400).json({error:'Both employees must be active project members.'});
    const {data:role,error:roleError}=await supabase.from('project_roles').select('id').eq('id',parsed.data.targetRoleId).eq('project_id',parsed.data.projectId).maybeSingle();if(roleError)throw roleError;if(!role)return res.status(400).json({error:'Selected role does not belong to this project.'});
    const {data:departing,error:profileError}=await supabase.from('user_profiles').select('full_name,email').eq('id',parsed.data.departingUserId).single();if(profileError)throw profileError;
    const {data,error}=await supabase.from('handovers').insert({project_id:parsed.data.projectId,title:parsed.data.title,description:parsed.data.description||null,departing_user_id:parsed.data.departingUserId,departing_user_name:departing.full_name,departing_user_email:departing.email,target_user_id:parsed.data.targetUserId,target_role_id:parsed.data.targetRoleId,created_by:uid(req),status:'GENERATING'}).select().single();if(error)throw error;
    // Permission filtering is applied before role relevance and report composition.
    const {data:rawFindings,error:findingError}=await supabase.from('knowledge_findings').select('id,category,classification,title,description,evidence_references(id,source_document_id,github_source_id,source_title,file_path,page_number,snippet,is_source_deleted)').eq('project_id',parsed.data.projectId).eq('status','ACTIVE');if(findingError)throw findingError;
    const permittedFindings=await filterFindingsForRole(parsed.data.projectId,parsed.data.targetRoleId,rawFindings||[]);
    const roleName=(await supabase.from('project_roles').select('name').eq('id',parsed.data.targetRoleId).single()).data?.name||'Team member';
    const roleTerms=roleName.toLowerCase().split(/[^a-z]+/).filter(Boolean);
    const relevant=permittedFindings.filter(f=> f.category!=='RESPONSIBILITY' || roleTerms.some(t=>`${f.title} ${f.description}`.toLowerCase().includes(t)) || roleTerms.includes('manager'));
    const reportContent={role:roleName,sections:{projectContext:relevant.filter(f=>f.category==='DECISION'),completedAndPending:relevant.filter(f=>f.category==='TASK'),responsibilities:relevant.filter(f=>f.category==='RESPONSIBILITY'),risksAndBlockers:relevant.filter(f=>['RISK','BLOCKER'].includes(f.category)),dependencies:relevant.filter(f=>f.category==='DEPENDENCY'),openQuestions:relevant.filter(f=>f.category==='UNRESOLVED_QUESTION')},limitations:'Findings without live evidence are omitted. Restricted-source findings are included only when the target role has an explicit source permission. Candidate excerpts still require manager verification.'};
    const summary=`Role-specific handover for ${roleName}. ${relevant.length} authorised project findings are included for manager review. Each finding retains its supporting source excerpt where available.`;
    const {data:report,error:reportError}=await supabase.from('handover_reports').insert({handover_id:data.id,version:1,title:`${data.title} — ${roleName} handover`,summary,structured_content:reportContent,status:'IN_REVIEW',generated_by:uid(req)}).select().single();if(reportError)throw reportError;
    await supabase.from('handovers').update({status:'IN_REVIEW'}).eq('id',data.id);
    res.status(201).json({handover:data,report,findingsIncluded:relevant.length});
  }catch(e){fail(res,e);}
});
api.get('/handovers', async (req: AuthedRequest,res)=>{
  const {data:members,error}=await supabase.from('project_members').select('project_id').eq('user_id',uid(req)).eq('is_active',true);if(error)return fail(res,error);
  const ids=(members||[]).map(m=>m.project_id);if(!ids.length)return res.json({handovers:[]});
  const {data,error:queryError}=await supabase.from('handovers').select('*,projects(name,key),handover_reports(id,title,status,summary,structured_content)').in('project_id',ids).order('created_at',{ascending:false});if(queryError)return fail(res,queryError);
  const visible=[];for(const handover of (data||[])){const {data:membership}=await supabase.from('project_members').select('role_id').eq('project_id',handover.project_id).eq('user_id',uid(req)).eq('is_active',true).maybeSingle();if(!membership)continue;const {data:role}=await supabase.from('project_roles').select('name').eq('id',membership.role_id).single();const manager=['MANAGER','OWNER','ADMIN','PROJECT MANAGER'].includes(String(role?.name).toUpperCase());if(manager||handover.target_user_id===uid(req)||handover.departing_user_id===uid(req)){const reports=manager?handover.handover_reports:(handover.target_user_id===uid(req)?(handover.handover_reports||[]).filter((r:any)=>r.status==='APPROVED'):[]);visible.push({...handover,handover_reports:reports});}}
  res.json({handovers:visible});
});
api.post('/reports/:reportId/decision', async (req: AuthedRequest,res)=>{
  const parsed=z.object({decision:z.enum(['APPROVED','REJECTED','CHANGES_REQUESTED']),comments:z.string().max(3000).optional()}).safeParse(req.body);if(!parsed.success)return res.status(400).json({error:'Invalid approval decision.'});
  const {data:report,error}=await supabase.from('handover_reports').select('id,handover_id,handovers(project_id)').eq('id',req.params.reportId).single();if(error)return fail(res,error);
  const handover=(report as any).handovers;try{await requireManager(uid(req),handover.project_id);}catch(e){return fail(res,e);}
  const {data:profile,error:profileError}=await supabase.from('user_profiles').select('full_name').eq('id',uid(req)).single();if(profileError)return fail(res,profileError);
  const {data:approval,error:approvalError}=await supabase.from('approvals').insert({report_id:report.id,reviewer_id:uid(req),reviewer_name:profile.full_name,decision:parsed.data.decision,comments:parsed.data.comments||null,decided_at:new Date().toISOString()}).select().single();if(approvalError)return fail(res,approvalError);
  const status=parsed.data.decision==='APPROVED'?'APPROVED':parsed.data.decision==='REJECTED'?'REJECTED':'IN_REVIEW';
  await supabase.from('handover_reports').update({status}).eq('id',report.id);await supabase.from('handovers').update({status:status==='APPROVED'?'APPROVED':status==='REJECTED'?'REJECTED':'IN_REVIEW'}).eq('id',report.handover_id);
  await supabase.from('audit_logs').insert({project_id:handover.project_id,actor_id:uid(req),actor_email:req.user?.email,actor_role:'MANAGER',action:parsed.data.decision,resource_type:'HANDOVER_REPORT',resource_id:report.id,details:{comments:parsed.data.comments||null}});
  res.json({approval,status});
});
api.get('/reports/:reportId', async (req: AuthedRequest,res)=>{
  const {data:report,error}=await supabase.from('handover_reports').select('*,handovers(id,project_id,target_user_id,departing_user_id,status)').eq('id',req.params.reportId).single();if(error)return fail(res,error);
  const handover=(report as any).handovers;try{const {membership}=await requireProjectMember(uid(req),handover.project_id);const {data:role}=await supabase.from('project_roles').select('name').eq('id',membership.role_id).single();const manager=['MANAGER','OWNER','ADMIN','PROJECT MANAGER'].includes(String(role?.name).toUpperCase());if(!manager && handover.target_user_id!==uid(req))return res.status(403).json({error:'This report is not assigned to your account.'});if(!manager && report.status!=='APPROVED')return res.status(403).json({error:'This report is not yet approved.'});}catch(e){return fail(res,e);}
  res.json({report});
});
api.post('/handovers/:handoverId/acknowledge',async(req:AuthedRequest,res)=>{
  const parsed=z.object({comments:z.string().max(3000).optional()}).safeParse(req.body||{});if(!parsed.success)return res.status(400).json({error:'Acknowledgement comments are too long.'});
  const {data:handover,error}=await supabase.from('handovers').select('id,project_id,target_user_id,status').eq('id',req.params.handoverId).single();if(error)return fail(res,error);
  if(handover.target_user_id!==uid(req))return res.status(403).json({error:'Only the assigned recipient can acknowledge this handover.'});
  if(handover.status!=='APPROVED')return res.status(409).json({error:'Only an approved handover can be acknowledged.'});
  const {data:existing,error:existingError}=await supabase.from('handover_acknowledgements').select('id').eq('handover_id',handover.id).maybeSingle();if(existingError)return fail(res,existingError);
  if(!existing){const {error:ackError}=await supabase.from('handover_acknowledgements').insert({handover_id:handover.id,recipient_id:uid(req),comments:parsed.data.comments||null});if(ackError)return fail(res,ackError);}
  const {error:updateError}=await supabase.from('handovers').update({status:'COMPLETED'}).eq('id',handover.id);if(updateError)return fail(res,updateError);
  await supabase.from('audit_logs').insert({project_id:handover.project_id,actor_id:uid(req),actor_email:req.user?.email,actor_role:'RECIPIENT',action:'HANDOVER_ACKNOWLEDGED',resource_type:'HANDOVER',resource_id:handover.id,details:{comments:parsed.data.comments||null}});
  res.json({acknowledged:true});
});
