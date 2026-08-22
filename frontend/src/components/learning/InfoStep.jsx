import { Lightbulb } from "lucide-react";

export default function InfoStep({ question, onContinue }) {
  const isRecap = question.stepNumber > 1;
  return <div className="mx-auto min-h-[calc(100vh-82px)] max-w-2xl px-5 py-8">
    <p className="text-xs font-black uppercase tracking-widest text-emerald-600">{isRecap ? "Recap" : "Concept"}</p>
    <h1 className="mt-1 text-2xl font-black leading-snug text-slate-800 sm:text-3xl">{question.heading}</h1>
    <p className="mt-3 text-base font-semibold leading-relaxed text-slate-600">{question.body}</p>
    {question.analogy && <div className="mt-5 rounded-2xl border-2 border-amber-200 bg-amber-50 p-5"><div className="flex items-center gap-2 font-black text-slate-800"><Lightbulb className="h-5 w-5 text-amber-500" />Analogy</div><p className="mt-1.5 font-semibold text-slate-600">{question.analogy}</p></div>}
    <button onClick={() => onContinue()} className="mt-8 w-full rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-3.5 font-black uppercase tracking-wide text-white active:translate-y-1 active:border-b-0">Continue</button>
  </div>;
}