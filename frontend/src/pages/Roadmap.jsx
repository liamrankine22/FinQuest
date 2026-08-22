import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import LearningHeader from "@/components/learning/LearningHeader";
import LessonNode from "@/components/learning/LessonNode";
import LessonIntro from "@/components/learning/LessonIntro";
import ProblemNode from "@/components/learning/ProblemNode";
import { getTier, lessons } from "@/lib/curriculum";
import { getProblemByLesson } from "@/lib/problems";

export default function Roadmap() {
  const params = new URLSearchParams(window.location.search); const tier = getTier(params.get("tier")); const navigate = useNavigate();
  const [progress, setProgress] = useState([]); const [profile, setProfile] = useState(null); const [loading, setLoading] = useState(true); const [selected, setSelected] = useState(null);
  useEffect(() => { Promise.all([base44.entities.LessonProgress.list("-updated_date"), base44.entities.LearningProfile.list("-updated_date", 1)]).then(([items, profiles]) => { setProgress(items); setProfile(profiles[0]); setLoading(false); }); }, []);
  const done = new Set(progress.filter((item) => item.completed).map((item) => item.lesson_id));
  const tierLessons = lessons.filter((lesson) => lesson.tier === tier.id);
  return <div className="min-h-screen bg-[#fbfcff]"><LearningHeader xp={profile?.xp} streak={profile?.streak} />
    <main className="mx-auto max-w-3xl px-4 pb-24"><button onClick={() => navigate("/tiers")} className="mt-5 flex items-center gap-1.5 font-extrabold text-slate-400 hover:text-slate-600"><ArrowLeft className="h-5 w-5" />All tiers</button>
      <section className="mt-4 rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 p-5 text-white"><p className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100">{`Tier ${tier.id}`}</p><h1 className="mt-1 text-2xl font-black">{tier.subtitle}</h1><p className="mt-1 font-semibold text-emerald-50">{tier.description}</p></section>
      {loading ? <div className="flex justify-center py-24"><div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" /></div> : <section className="py-10"><div className="mb-10 flex items-center gap-3"><div className="h-0.5 flex-1 bg-slate-200" /><h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Activities</h2><div className="h-0.5 flex-1 bg-slate-200" /></div><div className="space-y-10">{tierLessons.map((lesson, lessonIdx) => { const globalIndex = lessons.findIndex((item) => item.id === lesson.id); const prev = lessons[globalIndex - 1]; const prevProblem = prev && getProblemByLesson(prev.id); const lessonLocked = globalIndex > 0 && prev.tier === tier.id && (!done.has(prev.id) || (prevProblem && !done.has(prevProblem.id))); const problem = getProblemByLesson(lesson.id); const side = lessonIdx % 3 === 0 ? "left" : lessonIdx % 3 === 1 ? "right" : "center"; return <div key={lesson.id} className="space-y-5"><LessonNode lesson={lesson} completed={done.has(lesson.id)} locked={lessonLocked} side={side} onSelect={setSelected} />{problem && <ProblemNode problem={problem} completed={done.has(problem.id)} locked={!done.has(lesson.id)} side={side} />}</div>; })}</div></section>}
    </main>
    <AnimatePresence>{selected && <LessonIntro lesson={selected} completed={done.has(selected.id)} locked={false} onClose={() => setSelected(null)} />}</AnimatePresence>
  </div>;
}