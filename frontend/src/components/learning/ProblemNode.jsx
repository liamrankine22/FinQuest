import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ClipboardList, Lock } from "lucide-react";

export default function ProblemNode({ problem, completed, locked, side }) {
  const navigate = useNavigate();
  const [entering, setEntering] = useState(false);
  const position = side === "left" ? "-translate-x-14" : side === "right" ? "translate-x-14" : "";
  const circle = <div className={`relative flex h-16 w-16 items-center justify-center rounded-full border-b-[6px] transition active:translate-y-1 active:border-b-2 ${locked ? "border-slate-400 bg-slate-300" : "bg-amber-400 border-amber-600"}`}>
    {locked ? <Lock className="h-6 w-6 text-slate-500" /> : completed ? <Check className="h-8 w-8 stroke-[4] text-white" /> : <ClipboardList className="h-7 w-7 stroke-[3] text-white" />}
  </div>;
  return <div className={`relative flex flex-col items-center ${position}`}>
    {locked ? circle : <button onClick={() => setEntering(true)} aria-label={`Open ${problem.title}`} className="cursor-pointer">{circle}</button>}
    <div className="mt-2 w-36 text-center"><p className="font-extrabold text-amber-600">{problem.title}</p><p className="mt-1 text-xs font-semibold text-slate-400">10-question problem set</p></div>
    {entering && <motion.div initial={{ y: "100%" }} animate={{ y: "0%" }} transition={{ duration: 0.4, ease: "easeInOut" }} onAnimationComplete={() => navigate(`/problem?id=${problem.id}`)} className="fixed inset-0 z-[60] bg-white" />}
  </div>;
}