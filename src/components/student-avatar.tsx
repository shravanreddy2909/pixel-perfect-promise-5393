import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
export function StudentAvatar({ name, path }: { name: string; path?: string | null | undefined }) {
  const [url, setUrl] = useState('');
  useEffect(() => { let active = true; setUrl(''); if (path) void supabase.storage.from('avatars').createSignedUrl(path, 3600).then(({ data }) => { if (active) setUrl(data?.signedUrl ?? ''); }); return () => { active = false; }; }, [path]);
  return url ? <img className="avatar" src={url} alt={name} /> : <div className="avatar" aria-label={name}>{(name || 'S').split(' ').map(n => n[0]).slice(0,2).join('')}</div>;
}