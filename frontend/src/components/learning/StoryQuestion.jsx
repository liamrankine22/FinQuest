import { useState } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function StoryQuestion({ question, onContinue }) {
  const steps = question.steps || [question];
  const [stepIdx, setStepIdx] = useState(0);
  const [selected, setSelected] = useState({});
  const step = steps[stepIdx];
  const isLast = stepIdx === steps.length - 1;
  const chosenId = selected[step.stepNumber];
  const choice = step.choices.find((c) => c.id === chosenId);
  const allOptimal = steps.every((s) => s.choices.find((c) => c.id === selected[s.stepNumber])?.optimal);
  const pick = (id) => setSelected((prev) => ({ ...prev, [step.stepNumber]: id }));
  const next = () => { if (isLast) onContinue(allOptimal); else setStepIdx(stepIdx + 1); };

  return <div className="mx-auto min-h-[calc(100vh-82px)] max-w-2xl px-5 py-8">
    <div className="mb-5 flex items-center gap-1.5">{steps.map((s, i) => <div key={s.stepNumber} className={`h-2.5 flex-1 rounded-full ${i <= stepIdx ? "bg-emerald-500" : "bg-slate-200"}`} />)}</div>
    <div className="rounded-2xl border-2 border-slate-200 bg-white p-5"><p className="text-xs font-black uppercase tracking-widest text-emerald-600">{`Step ${step.stepNumber} of ${steps.length}`}</p><h1 className="mt-1 text-2xl font-black text-slate-800">{step.heading}</h1><p className="mt-2 font-semibold text-slate-500">{step.body}</p></div>
    <div className="mt-6 space-y-3">
      <div className="flex items-end gap-2.5"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-500 font-black text-white">{step.name[0]}</div><div><p className="mb-1 text-xs font-bold text-slate-400">{step.name}</p><div className="rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2.5 font-semibold text-slate-700">{step.m1}</div></div></div>
      <div className="ml-[3.25rem]"><div className="rounded-2xl rounded-bl-sm bg-slate-100 px-4 py-2.5 font-semibold text-slate-700">{step.m2}</div></div>
    </div>
    <div className="mt-6 space-y-3">{step.choices.map((c) => { const isSel = chosenId === c.id; return <button key={c.id} onClick={() => pick(c.id)} className={`w-full rounded-2xl border-2 border-b-4 p-4 text-left font-bold transition ${isSel ? (c.optimal ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-amber-400 bg-amber-50 text-amber-700") : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"} disabled:cursor-default`}>{c.text}</button>; })}</div>
    {choice && <div className={`mt-5 rounded-2xl border-2 p-4 ${choice.optimal ? "border-emerald-200 bg-emerald-50" : "border-amber-200 bg-amber-50"}`}><div className="flex items-center gap-2 font-black text-slate-700">{choice.optimal ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-amber-500" />}{choice.optimal ? "Solid choice" : "Worth reconsidering"}</div><p className="mt-1.5 font-semibold text-slate-600">{choice.response}</p></div>}
    {choice && <button onClick={next} className="mt-6 w-full rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-3.5 font-black uppercase tracking-wide text-white active:translate-y-1 active:border-b-0">{isLast ? "Finish story" : "Continue"}</button>}
  </div>;
}