import { queryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Skill = Database['public']['Tables']['skills']['Row'];
export type Exchange = Database['public']['Tables']['exchange_requests']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'];
export async function currentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error('Please sign in to continue.');
  return data.user;
}
export const studentOptions = () => queryOptions({ queryKey: ['students'], queryFn: async () => {
  const user = await currentUser();
  const profiles: Profile[] = []; const skills: Skill[] = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.from('profiles').select('*').order('id').range(offset, offset + 999);
    if (error) throw error; profiles.push(...data); if (data.length < 1000) break;
  }
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await supabase.from('skills').select('*').order('id').range(offset, offset + 999);
    if (error) throw error; skills.push(...data); if (data.length < 1000) break;
  }
  return { userId: user.id, profiles, skills };
} });
export const requestsOptions = () => queryOptions({ queryKey: ['requests'], queryFn: async () => {
  const user = await currentUser();
  const { data, error } = await supabase.from('exchange_requests').select('*').order('created_at', { ascending: false });
  if (error) throw error; return { userId: user.id, requests: data };
} });
export const messagesOptions = (id: string) => queryOptions({ queryKey: ['messages', id], queryFn: async () => {
  const { data, error } = await supabase.from('messages').select('*').eq('request_id', id).order('created_at');
  if (error) throw error; return data;
} });