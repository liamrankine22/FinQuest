import { Check, CreditCard, Gauge, Lock, PieChart, PiggyBank, Wallet } from "lucide-react";
const icons = { Wallet, PieChart, PiggyBank, CreditCard, Gauge };
const colors = { emerald: "bg-emerald-500 border-emerald-700 shadow-emerald-700", blue: "bg-sky-500 border-sky-700 shadow-sky-700", violet: "bg-violet-500 border-violet-700 shadow-violet-700", amber: "bg-amber-400 border-amber-600 shadow-amber-600", rose: "bg-rose-500 border-rose-700 shadow-rose-700" };

export default function LessonNode({ lesson, completed, locked, side, onSelect }) {
  const Icon = icons[lesson.icon];
  const position = side === "left" ? "-translate-x-14" : side === "right" ? "translate-x-14" : "";
  const circle = <div className={`relative flex h-20 w-20 items-center justify-center rounded-full border-b-[7px] transition active:translate-y-1 active:border-b-4 ${locked ? "border-slate-400 bg-slate-300" : colors[lesson.color]}`}>
    {locked ? <Lock className="h-8 w-8 text-slate-500" /> : completed ? <Check className="h-10 w-10 stroke-[4] text-white" /> : <Icon className="h-9 w-9 stroke-[3] text-white" />}
  </div>;
  return <div className={`flex flex-col items-center ${position}`}>
    {locked ? circle : <button onClick={() => onSelect(lesson)} aria-label={`Open ${lesson.title}`} className="cursor-pointer">{circle}</button>}
    <div className="mt-3 w-40 text-center"><p className="font-extrabold text-slate-700">{lesson.title}</p><p className="mt-1 text-xs font-semibold text-slate-400">{lesson.description}</p></div>
  </div>;
}