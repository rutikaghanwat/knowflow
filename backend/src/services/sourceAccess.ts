import { supabase } from '../config/supabase.js';

export async function canReadSource(projectId: string, roleId: string, sourceId: string, sourceType: 'DOCUMENT'|'GITHUB', accessLevel: string) {
  if (accessLevel !== 'RESTRICTED') return true;
  const { data: role, error: roleError } = await supabase.from('project_roles').select('name').eq('id', roleId).eq('project_id', projectId).maybeSingle();
  if (roleError) throw roleError;
  if (['MANAGER','OWNER','ADMIN','PROJECT MANAGER'].includes(String(role?.name).toUpperCase())) return true;
  const table = sourceType === 'DOCUMENT' ? 'source_document_id' : 'github_source_id';
  const { data, error } = await supabase.from('source_role_permissions').select('can_read').eq('project_id', projectId).eq(table, sourceId).eq('role_id', roleId).maybeSingle();
  if (error) throw error;
  return data?.can_read === true;
}

export async function filterFindingsForRole(projectId: string, roleId: string, findings: any[]) {
  const output=[];
  for (const finding of findings) {
    const evidence=[];
    for (const item of finding.evidence_references || []) {
      if (item.is_source_deleted) continue;
      if (item.source_document_id) {
        const {data,error}=await supabase.from('source_documents').select('access_level').eq('id',item.source_document_id).eq('project_id',projectId).maybeSingle();
        if(error)throw error;if(!data)continue;
        if(!await canReadSource(projectId,roleId,item.source_document_id,'DOCUMENT',data.access_level))continue;
      }
      if (item.github_source_id) {
        const {data,error}=await supabase.from('github_sources').select('access_level').eq('id',item.github_source_id).eq('project_id',projectId).maybeSingle();
        if(error)throw error;if(!data)continue;
        if(!await canReadSource(projectId,roleId,item.github_source_id,'GITHUB',data.access_level))continue;
      }
      evidence.push(item);
    }
    if(evidence.length)output.push({...finding,evidence_references:evidence});
  }
  return output;
}
export async function filterSourcesForRole(projectId: string, roleId: string, sources: any[]) {
  const result=[];
  for(const source of sources) if(await canReadSource(projectId,roleId,source.id,'DOCUMENT',source.access_level)) result.push(source);
  return result;
}
