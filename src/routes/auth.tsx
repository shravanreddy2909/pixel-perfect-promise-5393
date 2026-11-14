import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeftRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useStudentAuth } from '@/components/auth-provider';
import { pageHead } from '@/lib/metadata';
export const Route = createFileRoute('/auth')({ head: () => pageHead('Join the exchange', 'Sign in or create your free SkillSwap student account.'), component: AuthPage });
function AuthPage() {
  const [mode, setMode] = useState<'login'|'register'|'forgot'>('login'); const [busy,setBusy]=useState(false); const [message,setMessage]=useState(''); const [error,setError]=useState(''); const [show,setShow]=useState(false);
  const { user } = useStudentAuth(); const navigate=useNavigate();
  useEffect(() => { if(user) void navigate({to:'/dashboard'}); },[user,navigate]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true);setError('');setMessage(''); const f=new FormData(e.currentTarget); const email=String(f.get('email'));const password=String(f.get('password'));
    try {
      if(mode==='register') { const {data,error}=await supabase.auth.signUp({email,password,options:{emailRedirectTo:window.location.origin,data:{name:String(f.get('name'))}}}); if(error)throw error; if(!data.session)setMessage('Check your email to confirm your account, then come back to sign in.'); }
      else if(mode==='forgot') {const {error}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+'/reset-password'});if(error)throw error;setMessage('If an account exists, a password reset link is on its way.');}
      else {const {error}=await supabase.auth.signInWithPassword({email,password});if(error)throw error;await navigate({to:'/dashboard'});}
    }catch(e){setError(e instanceof Error?e.message:'Please try again.');}finally{setBusy(false);}
  }
  return <main className="page-wrap"><div className="max-w-md mx-auto py-5"><div className="float-icon mx-auto mb-5"><ArrowLeftRight/></div><p className="eyebrow text-primary text-center mb-3">Good things grow together</p><h1 className="section-title text-center">{mode==='register'?'Your next chapter starts here.':mode==='forgot'?'Let’s get you back in.':'Welcome back.'}</h1><p className="text-center text-sm text-muted-foreground mt-4 mb-8">{mode==='register'?'A skill to share. A world to learn. Always free.':'A little learning, a little sharing, a lot of possibility.'}</p>
  <div className="lift-card p-7"><form className="grid gap-5" onSubmit={submit}>{mode==='register'&&<label className="field">Full name<input name="name" required autoComplete="name" placeholder="Your name" maxLength={80}/></label>}<label className="field">Email address<input name="email" type="email" required autoComplete="email" placeholder="you@college.edu"/></label>{mode!=='forgot'&&<label className="field">Password<div className="relative"><input name="password" type={show?'text':'password'} required minLength={6} autoComplete={mode==='register'?'new-password':'current-password'} className="pr-12" placeholder="Your password"/><Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1" aria-label={show?'Hide password':'Show password'} onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</Button></div></label>}
  {error&&<p className="text-destructive text-sm" role="alert">{error}</p>}{message&&<p className="text-sage text-sm" role="status">{message}</p>}
  <Button type="submit" size="lg" disabled={busy}>{busy?'Please wait…':mode==='register'?'Create free account':mode==='forgot'?'Send reset link':'Sign in'}<ArrowRight/></Button></form>
  {mode==='login'&&<Button variant="link" className="w-full mt-2" onClick={()=>{setMode('forgot');setMessage('');setError('');}}>Forgot password?</Button>}
  <p className="text-sm text-center mt-5 text-muted-foreground">{mode==='register'?'Already part of the community?':mode==='forgot'?'Remember your password?':'New to SkillSwap?'} <Button variant="link" className="p-0 h-auto" onClick={()=>{setMode(mode==='login'?'register':'login');setMessage('');setError('');}}>{mode==='login'?'Join for free':'Sign in'}</Button></p></div><p className="text-xs text-muted-foreground text-center mt-6">No payments. No subscriptions. Just students helping students.</p><Link to="/" className="text-sm text-primary block text-center mt-5">Back to SkillSwap</Link></div></main>;
}