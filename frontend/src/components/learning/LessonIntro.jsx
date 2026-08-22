import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, CreditCard, Gauge, Lock, PieChart, PiggyBank, Wallet, X } from "lucide-react";
const icons = { Wallet, PieChart, PiggyBank, CreditCard, Gauge };
const colors = { emerald: "bg-emerald-500 border-emerald-700", blue: "bg-sky-500 border-sky-700", violet: "bg-violet-500 border-violet-700", amber: "bg-amber-400 border-amber-600", rose: "bg-rose-500 border-rose-700" };

export default function LessonIntro({ lesson, completed, locked, onClose }) {
  const navigate = useNavigate();
  const [entering, setEntering] = useState(false);
  const Icon = icons[lesson.icon];
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 p-5 backdrop-blur-sm">
    <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 text-white/80 hover:text-white"><X className="h-8 w-8" /></button>
    <motion.div initial={{ scale: 0.6, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="flex w-full max-w-md flex-col items-center rounded-3xl border-b-8 border-slate-200 bg-white p-8 text-center shadow-2xl">
      <div className={`flex h-24 w-24 items-center justify-center rounded-full border-b-[8px] ${colors[lesson.color]}`}>
        {locked ? <Lock className="h-10 w-10 text-white" /> : completed ? <Check className="h-12 w-12 stroke-[4] text-white" /> : <Icon className="h-11 w-11 stroke-[3] text-white" />}
      </div>
      <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="mt-5 text-3xl font-black text-slate-800">{lesson.title}</motion.h1>
      <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mt-3 min-h-[3rem] text-lg font-semibold text-slate-500">{lesson.description}</motion.p>
      <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.8 }} onClick={() => setEntering(true)} className="mt-7 w-full rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-4 font-black uppercase tracking-wide text-white active:translate-y-1 active:border-b-0">Enter activity</motion.button>
    </motion.div>
    {entering && <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 0.4, ease: "easeInOut" }} onAnimationComplete={() => navigate(`/lesson?id=${lesson.id}`)} className="fixed inset-0 z-[60] bg-white" />}
  </motion.div>;
}