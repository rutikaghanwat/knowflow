import { supabase } from '../config/supabase.js';

export async function requireOrgMember(userId: string, organizationId: string) {
  const { data, error } = await supabase.from('organization_members').select('role').eq('organization_id', organizationId).eq('user_id', userId).maybeSingle();
  if (error) throw error;
  if (!data) throw Object.assign(new Error('You do not have access to this organisation.'), { statusCode: 403 });
  return data;
}
export async function requireProjectMember(userId: string, projectId: string) {
  const { data, error } = await supabase.from('projects').select('id,organization_id,name,key,description,status').eq('id', projectId).maybeSingle();
  if (error) throw error;
  if (!data) throw Object.assign(new Error('Project not found.'), { statusCode: 404 });
  await requireOrgMember(userId, data.organization_id);
  const { data: membership, error: memberError } = await supabase.from('project_members').select('id,role_id').eq('project_id', projectId).eq('user_id', userId).eq('is_active', true).maybeSingle();
  if (memberError) throw memberError;
  if (!membership) throw Object.assign(new Error('You are not an active member of this project.'), { statusCode: 403 });
  return { project: data, membership };
}
export async function requireManager(userId: string, projectId: string) {
  const { project, membership } = await requireProjectMember(userId, projectId);
  const { data, error } = await supabase.from('project_roles').select('name').eq('id', membership.role_id).single();
  if (error) throw error;
  if (!['OWNER','ADMIN','MANAGER','PROJECT MANAGER'].includes(String(data.name).toUpperCase())) {
    throw Object.assign(new Error('Manager permission required.'), { statusCode: 403 });
  }
  return project;
}
