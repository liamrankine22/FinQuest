import { CheckCircle2, XCircle } from "lucide-react";

export default function QuestionCard({ question, selected, checked, onSelect, onContinue }) {
  const correct = selected === question.answer;
  return <div className="mx-auto flex min-h-[calc(100vh-82px)] max-w-2xl flex-col px-5 py-8">
    <div className="flex-1"><p className="mb-2 text-sm font-black uppercase tracking-widest text-emerald-600">Choose one answer</p><h1 className="mb-8 text-2xl font-black leading-tight text-slate-800 sm:text-3xl">{question.prompt}</h1>
      <div className="space-y-3">{question.options.map((option, index) => <button key={option} onClick={() => onSelect(index)} className={`w-full rounded-2xl border-2 border-b-4 p-4 text-left font-bold transition ${selected === index ? "border-sky-500 bg-sky-50 text-sky-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}><span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-lg border-2 border-current text-sm">{index + 1}</span>{option}</button>)}</div>
    </div>
    {checked && <div className={`-mx-5 mt-8 p-5 ${correct ? "bg-emerald-100" : "bg-rose-100"}`}><div className="mx-auto max-w-2xl"><div className={`flex items-center gap-2 text-xl font-black ${correct ? "text-emerald-700" : "text-rose-700"}`}>{correct ? <CheckCircle2 /> : <XCircle />}{correct ? "Great job!" : `Answer: ${question.options[question.answer]}`}</div><p className="mt-2 font-semibold text-slate-600">{question.note}</p><button onClick={onContinue} className={`mt-4 w-full rounded-2xl border-b-4 px-5 py-3 font-black uppercase tracking-wide text-white active:translate-y-1 active:border-b-0 ${correct ? "border-emerald-700 bg-emerald-500" : "border-rose-700 bg-rose-500"}`}>Continue</button></div></div>}
  </div>;
}