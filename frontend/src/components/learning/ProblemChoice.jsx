import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

export default function ProblemChoice({ question, onContinue }) {
  const [selected, setSelected] = useState(null);
  const options = [1, 2, 3, 4].map((n) => ({ n, text: question[`a${n}`] }));
  const revealed = selected !== null;
  const isCorrect = selected === question.correct;
  return <div className="mx-auto min-h-[calc(100vh-82px)] max-w-2xl px-5 py-8">
    <p className="text-xs font-black uppercase tracking-widest text-amber-600">{`Question ${question.id}`}</p>
    <h1 className="mt-1 text-2xl font-black leading-snug text-slate-800">{question.question}</h1>
    <div className="mt-6 space-y-3">
      {options.map((o) => {
        const sel = selected === o.n;
        const correctOpt = question.correct === o.n;
        return <button key={o.n} onClick={() => { if (selected === null) setSelected(o.n); }} className={`flex w-full items-center gap-3 rounded-2xl border-2 border-b-4 p-4 text-left font-bold transition ${sel ? (correctOpt ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-rose-400 bg-rose-50 text-rose-700") : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"} ${revealed && !sel ? "opacity-50" : ""}`}>
          <span className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black ${sel ? "bg-white/70" : "bg-slate-100 text-slate-500"}`}>{o.n}</span><span>{o.text}</span>
        </button>;
      })}
    </div>
    {revealed && <div className={`mt-5 rounded-2xl border-2 p-4 ${isCorrect ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
      <div className="flex items-center gap-2 font-black text-slate-700">{isCorrect ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <XCircle className="h-5 w-5 text-rose-500" />}{isCorrect ? "Correct!" : "Not quite"}</div>
    </div>}
    {revealed && <button onClick={() => onContinue(isCorrect)} className="mt-6 w-full rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-3.5 font-black uppercase tracking-wide text-white active:translate-y-1 active:border-b-0">Continue</button>}
  </div>;
}