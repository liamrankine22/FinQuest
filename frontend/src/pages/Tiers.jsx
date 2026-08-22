import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CreditCard, Gauge, PiggyBank, Wallet } from "lucide-react";
import { base44 } from "@/api/base44Client";
import LearningHeader from "@/components/learning/LearningHeader";
import { tiers, lessons } from "@/lib/curriculum";
import { getProblemByLesson, problems } from "@/lib/problems";

const tierColors = { emerald: { ring: "border-emerald-500", bg: "bg-emerald-500", shadow: "shadow-emerald-700", soft: "bg-emerald-50", text: "text-emerald-600" }, violet: { ring: "border-violet-500", bg: "bg-violet-500", shadow: "shadow-violet-700", soft: "bg-violet-50", text: "text-violet-600" }, rose: { ring: "border-rose-500", bg: "bg-rose-500", shadow: "shadow-rose-700", soft: "bg-rose-50", text: "text-rose-600" }, amber: { ring: "border-amber-500", bg: "bg-amber-500", shadow: "shadow-amber-700", soft: "bg-amber-50", text: "text-amber-600" } };
const tierIcons = { Wallet, CreditCard, Gauge, PiggyBank };

export default function Tiers() {
  const [progress, setProgress] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { base44.entities.LessonProgress.list("-updated_date").then((items) => { setProgress(items); setLoading(false); }); }, []);
  const done = new Set(progress.filter((item) => item.completed).map((item) => item.lesson_id));
  return <div className="min-h-screen bg-[#fbfcff]"><LearningHeader />
    <main className="mx-auto max-w-3xl px-4 pb-24">
      {loading ? <div className="flex justify-center py-24"><div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" /></div> : <div className="mt-8 space-y-5">{tiers.map((tier) => { const Icon = tierIcons[tier.icon]; const c = tierColors[tier.color]; const tierLessons = lessons.filter((lesson) => lesson.tier === tier.id); const tierProblems = tierLessons.map((l) => getProblemByLesson(l.id)).filter(Boolean); const totalActivities = tierLessons.length + tierProblems.length; const completedCount = tierLessons.filter((l) => done.has(l.id)).length + tierProblems.filter((p) => done.has(p.id)).length; const pct = Math.round((completedCount / totalActivities) * 100); return <Link key={tier.id} to={`/roadmap?tier=${tier.id}`} className={`block rounded-3xl border-2 border-b-8 ${c.ring} ${c.soft} p-6 transition active:translate-y-1 active:border-b-2`}><div className="flex items-center gap-5"><div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-b-4 ${c.shadow} ${c.bg}`}><Icon className="h-9 w-9 stroke-[3] text-white" /></div><div className="flex-1"><p className={`text-xs font-black uppercase tracking-widest ${c.text}`}>{tier.title}</p><h2 className="mt-0.5 text-xl font-black text-slate-800">{tier.subtitle}</h2><p className="mt-1 text-sm font-semibold text-slate-500">{tier.description}</p></div><ArrowRight className="h-6 w-6 text-slate-400" /></div><div className="mt-5 flex items-center gap-3"><div className="h-3 flex-1 overflow-hidden rounded-full bg-white/70"><div className={`h-full rounded-full ${c.bg}`} style={{ width: `${pct}%` }} /></div><span className="text-sm font-black text-slate-600">{completedCount}/{totalActivities} activities</span></div></Link>; })}</div>}
    </main></div>;
}