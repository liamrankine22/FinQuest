import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import DragDropQuestion from "@/components/learning/DragDropQuestion";
import StoryQuestion from "@/components/learning/StoryQuestion";
import HigherLowerQuestion from "@/components/learning/HigherLowerQuestion";
import GaugeQuestion from "@/components/learning/GaugeQuestion";
import SimulatorQuestion from "@/components/learning/SimulatorQuestion";
import InfoStep from "@/components/learning/InfoStep";
import ScenarioChoice from "@/components/learning/ScenarioChoice";
import { getLesson, getTier } from "@/lib/curriculum";

const isScored = (s) => s.type != null || !!s.scenario;

export default function Lesson() {
  const params = new URLSearchParams(window.location.search);
  const lesson = getLesson(params.get("id"));
  const tier = getTier(lesson.tier);
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [saving, setSaving] = useState(false);
  const [revealing, setRevealing] = useState(true);
  const scoredCount = lesson.steps.filter(isScored).length;
  const step = lesson.steps[index];

  const finish = async (finalCorrect) => {
    setSaving(true);
    const user = await base44.auth.me();
    const score = scoredCount ? Math.round((finalCorrect / scoredCount) * 100) : 100;
    const existing = await base44.entities.LessonProgress.filter({ lesson_id: lesson.id, created_by_id: user.id });
    const payload = { lesson_id: lesson.id, lesson_title: lesson.title, score, correct_answers: finalCorrect, total_questions: scoredCount, completed: true };
    if (existing[0]) await base44.entities.LessonProgress.update(existing[0].id, payload);
    else await base44.entities.LessonProgress.create(payload);
    const profiles = await base44.entities.LearningProfile.filter({ created_by_id: user.id });
    const xp = finalCorrect * 10;
    if (profiles[0]) await base44.entities.LearningProfile.update(profiles[0].id, { xp: (profiles[0].xp || 0) + xp, completed_lessons: (profiles[0].completed_lessons || 0) + (existing[0]?.completed ? 0 : 1), streak: profiles[0].streak || 1 });
    else await base44.entities.LearningProfile.create({ xp, completed_lessons: 1, streak: 1 });
    navigate("/results", { state: { lesson, correct: finalCorrect, score, xp, total: scoredCount } });
  };

  const [transition, setTransition] = useState("none");
  const pendingCorrect = useRef(null);

  const handleAdvance = (isCorrect) => {
    pendingCorrect.current = isCorrect;
    setTransition("cover");
  };

  const applyAdvance = () => {
    const isCorrect = pendingCorrect.current;
    const nextCorrect = correct + (isScored(step) && isCorrect ? 1 : 0);
    if (index === lesson.steps.length - 1) {
      finish(nextCorrect);
      setTransition("none");
    } else {
      setIndex(index + 1);
      setCorrect(nextCorrect);
      setTransition("reveal");
    }
  };

  const renderStep = () => {
    if (step.type === 1) return <DragDropQuestion question={step} onContinue={handleAdvance} />;
    if (step.type === 2) return <StoryQuestion question={step} onContinue={handleAdvance} />;
    if (step.type === 3) return <HigherLowerQuestion question={step} onContinue={handleAdvance} />;
    if (step.type === 4) return <GaugeQuestion question={step} onContinue={handleAdvance} />;
    if (step.type === 5) return <SimulatorQuestion question={step} onContinue={handleAdvance} />;
    if (step.scenario) return <ScenarioChoice question={step} onContinue={handleAdvance} />;
    return <InfoStep question={step} onContinue={handleAdvance} />;
  };

  return <div className="min-h-screen bg-white">
    <header className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-5">
      <button onClick={() => navigate(`/roadmap?tier=${tier.id}`)} aria-label="Exit lesson"><X className="h-7 w-7 text-slate-400" /></button>
      <div className="h-4 flex-1 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width: `${((index + 1) / lesson.steps.length) * 100}%` }} /></div>
    </header>
    {saving ? <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4"><div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-500" /><p className="font-bold text-slate-500">Saving your progress…</p></div> : renderStep()}
    {revealing && <motion.div initial={{ y: "0%" }} animate={{ y: "100%" }} transition={{ duration: 0.4, ease: "easeInOut" }} onAnimationComplete={() => setRevealing(false)} className="fixed inset-0 z-[60] bg-white" />}
    {transition === "cover" && <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 0.35, ease: "easeInOut" }} onAnimationComplete={applyAdvance} className="fixed inset-0 z-[60] bg-white" />}
    {transition === "reveal" && <motion.div initial={{ y: "0%" }} animate={{ y: "100%" }} transition={{ duration: 0.35, ease: "easeInOut" }} onAnimationComplete={() => setTransition("none")} className="fixed inset-0 z-[60] bg-white" />}
  </div>;
}