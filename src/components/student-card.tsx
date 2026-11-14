import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeftRight, ArrowRight, GraduationCap, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { StudentAvatar } from './student-avatar';
import { supabase } from '@/integrations/supabase/client';
import { type Profile, type Skill } from '@/lib/student-data';
import { matchStudents } from '@/lib/matching';
export function StudentCard({ profile, skills, mine, userId, matching = false }: { profile: Profile; skills: Skill[]; mine: Skill[]; userId: string; matching?: boolean }) {
  const [open, setOpen] = useState(false); const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient(); const match = matchStudents(mine, skills);
  const teach = skills.filter(s => s.kind === 'teach'); const learn = skills.filter(s => s.kind === 'learn'); const offered = mine.filter(s => s.kind === 'teach');
  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const values = new FormData(event.currentTarget); setBusy(true);
    const { error } = await supabase.from('exchange_requests').insert({ sender_id: userId, recipient_id: profile.id, teach_skill: String(values.get('teach')), learn_skill: String(values.get('learn')), message: String(values.get('message')) });
    setBusy(false); if (error) { toast.error(error.message); return; } setOpen(false); toast.success('Exchange request sent!'); void queryClient.invalidateQueries({ queryKey: ['requests'] });
  }
  return <><article className="lift-card p-6 flex flex-col">
    {matching && <div className="mb-5 flex items-center justify-between text-xs text-sage"><span className="flex gap-1 items-center"><Sparkles size={13}/>Mutual skill fit</span><strong>{match.score}% match</strong></div>}
    <div className="flex gap-3 items-center"><StudentAvatar name={profile.name} path={profile.avatar_path}/><div className="min-w-0"><h3 className="text-xl truncate">{profile.name || 'New student'}</h3><p className="text-xs text-muted-foreground truncate mt-1">{profile.college || 'College not added'}</p></div></div>
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mt-4"><GraduationCap size={14}/>{[profile.branch, profile.year && `Year ${profile.year}`].filter(Boolean).join(' · ') || 'Getting started'}</p>
    {profile.bio && <p className="text-sm text-muted-foreground mt-3 line-clamp-2">{profile.bio}</p>}
    <div className="mt-6"><p className="eyebrow text-muted-foreground mb-2">Can teach</p><div className="flex flex-wrap gap-1.5">{teach.length ? teach.map(s => <span className="skill-pill" key={s.id} title={s.level ?? undefined}>{s.name}</span>) : <span className="text-xs text-muted-foreground">No skills yet</span>}</div></div>
    <div className="mt-4 mb-6"><p className="eyebrow text-muted-foreground mb-2">Wants to learn</p><div className="flex flex-wrap gap-1.5">{learn.length ? learn.map(s => <span className="skill-pill learn-pill" key={s.id}>{s.name}</span>) : <span className="text-xs text-muted-foreground">Open to new skills</span>}</div></div>
    {matching && <p className="text-xs text-muted-foreground mb-4">{match.reason}</p>}
    <Button variant="outline" className="mt-auto w-full" onClick={() => setOpen(true)}><ArrowLeftRight/>Request exchange<ArrowRight className="ml-auto"/></Button>
  </article>
  <Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle className="text-2xl">Exchange with {profile.name || 'this student'}</DialogTitle><DialogDescription>A little give. A little grow.</DialogDescription></DialogHeader>{!offered.length || !teach.length ? <p className="text-sm text-muted-foreground">Both students need a teaching skill before exchanging. Add yours on My profile.</p> : <form onSubmit={send} className="grid gap-5 mt-3"><label className="field">I’ll teach<select name="teach" required>{offered.map(s => <option key={s.id}>{s.name}</option>)}</select></label><label className="field">I’d like to learn<select name="learn" required>{teach.map(s => <option key={s.id}>{s.name}</option>)}</select></label><label className="field">A message<textarea name="message" placeholder="Say hello and share what you have in mind…" rows={3} maxLength={1000}/></label><Button disabled={busy} type="submit">{busy ? 'Sending…' : 'Send exchange request'}<ArrowRight/></Button></form>}</DialogContent></Dialog></>;
}