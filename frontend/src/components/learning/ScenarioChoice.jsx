import { useState } from "react";
import { AlertCircle, CheckCircle2, Sparkles } from "lucide-react";

export default function ScenarioChoice({ question, onContinue }) {
  const [choice, setChoice] = useState(null);
  const positive = choice === "positive";
  return <div className="mx-auto min-h-[calc(100vh-82px)] max-w-2xl px-5 py-8">
    <p className="text-xs font-black uppercase tracking-widest text-emerald-600">Scenario</p>
    <h1 className="mt-1 text-2xl font-black leading-snug text-slate-800 sm:text-3xl">{question.heading}</h1>
    <div className="mt-4 rounded-2xl border-2 border-slate-200 bg-slate-50 p-4"><p className="font-semibold text-slate-600">{question.scenario}</p></div>
    <p className="mt-6 text-sm font-black uppercase tracking-widest text-slate-400">Choose your move</p>
    <div className="mt-3 space-y-3">
      <button onClick={() => setChoice("positive")} className={`w-full rounded-2xl border-2 border-b-4 p-4 text-left font-bold transition ${choice === "positive" ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{question.positiveChoice}</button>
      <button onClick={() => setChoice("negative")} className={`w-full rounded-2xl border-2 border-b-4 p-4 text-left font-bold transition ${choice === "negative" ? "border-rose-400 bg-rose-50 text-rose-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>{question.negativeChoice}</button>
    </div>
    {choice && <>
      <div className={`mt-5 rounded-2xl border-2 p-4 ${positive ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
        <div className="flex items-center gap-2 font-black text-slate-800">{positive ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 text-rose-500" />}{positive ? "Smart move" : "Costly move"}</div>
        <p className="mt-1.5 font-semibold text-slate-600">{positive ? question.positiveText : question.negativeText}</p>
      </div>
      <div className="mt-4 flex items-start gap-2 rounded-2xl border-2 border-sky-200 bg-sky-50 p-4"><Sparkles className="mt-0.5 h-5 w-5 shrink-0 text-sky-500" /><p className="font-semibold text-slate-600">{question.lesson}</p></div>
      <button onClick={() => onContinue(positive)} className="mt-6 w-full rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-3.5 font-black uppercase tracking-wide text-white active:translate-y-1 active:border-b-0">Continue</button>
    </>}
  </div>;
}