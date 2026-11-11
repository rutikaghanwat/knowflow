import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { AuthSession, apiRequest, getSession, signIn, signOut, signUp } from '../services/api';

export type UserRolePerspective = 'manager' | 'departing' | 'incoming' | 'member';
interface AuthUser { id:string; name:string; email:string; role:string; organization:string; avatar:string; timezone:string; notificationsEnabled:boolean; aiSensitivity:'balanced'; perspective:UserRolePerspective; activeProjectName:string; activeHandoverId?:string; }
type Profile = { id:string; email:string; full_name:string; avatar_url?:string|null; role?:string; perspective?:UserRolePerspective; organization?:string };
interface AuthContextType { currentUser:AuthUser; isAuthenticated:boolean; isLoading:boolean; login:(email:string,password:string)=>Promise<{success:boolean;redirectPath:string}>; register:(email:string,password:string,name:string,organization:string,role:string)=>Promise<void>; logout:()=>void; refreshProfile:()=>Promise<void>; activeHandover?:undefined; }
const AuthContext=createContext<AuthContextType|undefined>(undefined);
const emptyUser:AuthUser={id:'',name:'Workspace member',email:'',role:'Member',organization:'Your workspace',avatar:'',timezone:'UTC',notificationsEnabled:true,aiSensitivity:'balanced',perspective:'manager',activeProjectName:'Select a project'};
function mapUser(session:AuthSession,profile:Profile|null):AuthUser { const meta=session.user.user_metadata||{};return {...emptyUser,id:session.user.id,email:profile?.email||session.user.email||'',name:profile?.full_name||String(meta.full_name||meta.name||session.user.email?.split('@')[0]||'Workspace member'),avatar:profile?.avatar_url||'',role:profile?.role||String(meta.role||'Member'),organization:profile?.organization||'Your workspace',perspective:profile?.perspective||'manager'}; }
async function completePendingOrganization() {
  const pendingOrg=localStorage.getItem('knowflow_pending_org');
  if(!pendingOrg)return;
  const existing=await apiRequest<{organizations:{organizations:{id:string}}[]}>('/organizations');
  if(!existing.organizations?.length) await apiRequest('/organizations',{method:'POST',body:JSON.stringify({name:pendingOrg})});
  localStorage.removeItem('knowflow_pending_org');
}
export const AuthProvider:React.FC<{children:React.ReactNode}>=({children})=>{
 const [session,setSession]=useState<AuthSession|null>(()=>getSession());const [profile,setProfile]=useState<Profile|null>(null);const [isLoading,setIsLoading]=useState(false);const [profileLoading,setProfileLoading]=useState(!!getSession()?.access_token);
 const refreshProfile=async()=>{if(!getSession()?.access_token){setProfile(null);setProfileLoading(false);return;}setProfileLoading(true);try{const result=await apiRequest<{user:Profile}>('/me');setProfile(result.user);}finally{setProfileLoading(false);}};
 useEffect(()=>{const sync=()=>setSession(getSession());window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);},[]);
 useEffect(()=>{if(!session?.access_token){setProfile(null);setProfileLoading(false);return;}let active=true;setProfileLoading(true);apiRequest<{user:Profile}>('/me').then(r=>{if(active)setProfile(r.user);}).catch(()=>{if(active)setProfile(null);}).finally(()=>{if(active)setProfileLoading(false);});return()=>{active=false;};},[session?.user.id]);
 const currentUser=useMemo(()=>session?mapUser(session,profile):emptyUser,[session,profile]);
 const login=async(email:string,password:string)=>{setIsLoading(true);try{const next=await signIn(email,password);setSession(next);await completePendingOrganization();await refreshProfile();return{success:true,redirectPath:'/app'};}finally{setIsLoading(false);}};
 const register=async(email:string,password:string,name:string,organization:string,role:string)=>{setIsLoading(true);try{await signUp(email,password,name,role);const next=getSession();if(!next){localStorage.setItem('knowflow_pending_org',organization);throw new Error('Account created. Confirm your email, then sign in. Your workspace will be created after sign-in.');}setSession(next);localStorage.setItem('knowflow_pending_org',organization);await completePendingOrganization();await refreshProfile();}finally{setIsLoading(false);}};
 const logout=()=>{signOut();setSession(null);setProfile(null);};
 return <AuthContext.Provider value={{currentUser,isAuthenticated:!!session?.access_token,isLoading:isLoading||profileLoading,login,register,logout,refreshProfile,activeHandover:undefined}}>{children}</AuthContext.Provider>;
};
export const useAuth=():AuthContextType=>{const context=useContext(AuthContext);if(!context)throw new Error('useAuth must be used within an AuthProvider');return context;};
