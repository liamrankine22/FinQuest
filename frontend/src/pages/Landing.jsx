import { Link, Navigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { tiers, lessons } from "@/lib/curriculum";
import { problems } from "@/lib/problems";

export default function Landing() {
  const { isAuthenticated, authChecked } = useAuth();
  if (!authChecked) return <div className="flex min-h-screen items-center justify-center"><div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" /></div>;
  if (isAuthenticated) return <Navigate to="/tiers" replace />;
  return <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white">
    <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
      <div className="text-2xl font-black tracking-tight text-emerald-600">FINQUEST</div>
      <div className="flex items-center gap-2">
        <Link to="/login" className="rounded-2xl px-4 py-2 font-black text-slate-600 hover:text-slate-900">Log in</Link>
        <Link to="/register" className="rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-4 py-2 font-black text-white active:translate-y-1 active:border-b-0">Sign up</Link>
      </div>
    </header>
    <main className="mx-auto max-w-5xl px-5 pb-20">
      <section className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-widest text-emerald-700"><Sparkles className="h-3.5 w-3.5" /> Learn finance like a game</span>
        <h1 className="mt-4 text-4xl font-black leading-tight text-slate-800 sm:text-5xl">Master personal finance through<br className="hidden sm:block" /> daily, bite-sized lessons</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg font-semibold text-slate-500">FinQuest makes saving, investing, and budgeting as engaging as a game. Climb through tiers, build real-world skills, and keep your streak alive.</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link to="/register" className="inline-flex items-center gap-2 rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-6 py-3.5 font-black uppercase tracking-wide text-white active:translate-y-1 active:border-b-0">Start learning free <ArrowRight className="h-5 w-5" /></Link>
          <Link to="/login" className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-3.5 font-black uppercase tracking-wide text-slate-700 active:translate-y-1 active:border-b-0">I have an account</Link>
        </div>
      </section>
      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border-2 border-b-4 border-emerald-200 bg-white p-5 text-center"><p className="text-3xl font-black text-emerald-600">{lessons.length}</p><p className="mt-1 text-sm font-bold uppercase tracking-wide text-slate-500">Activities</p></div>
        <div className="rounded-2xl border-2 border-b-4 border-amber-200 bg-white p-5 text-center"><p className="text-3xl font-black text-amber-600">{problems.length}</p><p className="mt-1 text-sm font-bold uppercase tracking-wide text-slate-500">Problem sets</p></div>
        <div className="rounded-2xl border-2 border-b-4 border-sky-200 bg-white p-5 text-center"><p className="text-3xl font-black text-sky-600">{tiers.length}</p><p className="mt-1 text-sm font-bold uppercase tracking-wide text-slate-500">Tiers</p></div>
      </section>
      <section className="mt-10">
        <h2 className="text-center text-xs font-black uppercase tracking-widest text-slate-400">What you'll learn</h2>
        <div className="mt-4 flex flex-wrap justify-center gap-2.5">{["Budgeting", "Credit scores", "Compound interest", "Index funds", "Inflation", "Taxes", "Emergency funds", "401(k) matching"].map((t) => <span key={t} className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-bold text-slate-700">{t}</span>)}</div>
      </section>
      <section className="mt-12 mx-auto max-w-sm">
        <div className="rounded-2xl border-2 border-slate-100 bg-white p-5"><ShieldCheck className="h-7 w-7 text-emerald-500" /><h3 className="mt-3 font-black text-slate-800">Real-world skills</h3><p className="mt-1 text-sm font-semibold text-slate-500">Practical money lessons you'll actually use in everyday life.</p></div>
      </section>
    </main>
  </div>;
}