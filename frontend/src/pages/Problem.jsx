import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import ProblemChoice from "@/components/learning/ProblemChoice";
import ProblemMultiSelect from "@/components/learning/ProblemMultiSelect";
import ProblemDialogue from "@/components/learning/ProblemDialogue";
import ProblemMatching from "@/components/learning/ProblemMatching";
import { getProblem } from "@/lib/problems";
import { getTier } from "@/lib/curriculum";

const renderers = { 1: ProblemChoice, 2: ProblemMultiSelect, 3: ProblemDialogue, 4: ProblemMatching };

export default function Problem() {
  const params = new URLSearchParams(window.location.search);
  const problem = getProblem(params.get("id"));
  const tier = getTier(problem.tier);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [saving, setSaving] = useState(false);
  const [revealing, setRevealing] = useState(true);
  const [transition, setTransition] = useState("none");
  const pendingCorrect = useRef(null);
  const total = problem.questions.length;
  const question = problem.questions[index];

  const finish = async (finalCorrect) => {
    setSaving(true);
    const user = await base44.auth.me();
    const score = Math.round((finalCorrect / total) * 100);
    const passed = score >= 80;
    const existing = await base44.entities.LessonProgress.filter({ lesson_id: problem.id, created_by_id: user.id });
    const payload = { lesson_id: problem.id, lesson_title: problem.title, score, correct_answers: finalCorrect, total_questions: total, completed: passed };
    if (existing[0]) await base44.entities.LessonProgress.update(existing[0].id, payload);
    else await base44.entities.LessonProgress.create(payload);
    const profiles = await base44.entities.LearningProfile.filter({ created_by_id: user.id });
    const xp = finalCorrect * 10;
    if (profiles[0]) await base44.entities.LearningProfile.update(profiles[0].id, { xp: (profiles[0].xp || 0) + xp, completed_lessons: (profiles[0].completed_lessons || 0) + (passed && !existing[0]?.completed ? 1 : 0), streak: profiles[0].streak || 1 });
    else await base44.entities.LearningProfile.create({ xp, completed_lessons: 1, streak: 1 });
    navigate("/results", { state: { lesson: { id: problem.id, title: problem.title, tier: problem.tier }, correct: finalCorrect, score, xp, total, passed, retryPath: `/problem?id=${problem.id}` } });
  };

  const handleAdvance = (isCorrect) => { pendingCorrect.current = isCorrect; setTransition("cover"); };
  const applyAdvance = () => {
    const isCorrect = pendingCorrect.current;
    const nextCorrect = correct + (isCorrect ? 1 : 0);
    if (index === total - 1) { finish(nextCorrect); setTransition("none"); }
    else { setIndex(index + 1); setCorrect(nextCorrect); setTransition("reveal"); }
  };

  const Renderer = renderers[question.type];
  return <div className="min-h-screen bg-white">
    <header className="sticky top-0 z-[70] mx-auto flex max-w-2xl items-center gap-4 bg-white px-5 py-5">
      <button onClick={() => navigate(`/roadmap?tier=${tier.id}`)} aria-label="Exit problem set"><X className="h-7 w-7 text-slate-400" /></button>
      <div className="h-4 flex-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-amber-500 transition-all duration-300" style={{ width: `${((index + 1) / total) * 100}%` }} /></div>
      <span className="text-xs font-black text-slate-400">{index + 1}/{total}</span>
    </header>
    {saving ? <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4"><div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-100 border-t-amber-500" /><p className="font-bold text-slate-500">Saving your progress…</p></div> : <Renderer question={question} onContinue={handleAdvance} />}
    {revealing && <motion.div initial={{ y: "0%" }} animate={{ y: "100%" }} transition={{ duration: 0.4, ease: "easeInOut" }} onAnimationComplete={() => setRevealing(false)} className="fixed left-0 right-0 bottom-0 top-[4.25rem] z-[60] bg-white" />}
    {transition === "cover" && <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 0.35, ease: "easeInOut" }} onAnimationComplete={applyAdvance} className="fixed left-0 right-0 bottom-0 top-[4.25rem] z-[60] bg-white" />}
    {transition === "reveal" && <motion.div initial={{ y: "0%" }} animate={{ y: "100%" }} transition={{ duration: 0.35, ease: "easeInOut" }} onAnimationComplete={() => setTransition("none")} className="fixed left-0 right-0 bottom-0 top-[4.25rem] z-[60] bg-white" />}
  </div>;
}