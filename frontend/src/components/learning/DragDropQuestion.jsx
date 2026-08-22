import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { CheckCircle2, XCircle } from "lucide-react";

export default function DragDropQuestion({ question, onContinue }) {
  const [placements, setPlacements] = useState({});
  const [checked, setChecked] = useState(false);
  const poolItems = question.items.filter((it) => placements[it.id] == null);
  const bucketItems = (catId) => question.items.filter((it) => placements[it.id] === catId);
  const allPlaced = question.items.every((it) => placements[it.id] != null);
  const isCorrect = (item) => placements[item.id] === item.correctCat;
  const allCorrect = question.items.every(isCorrect);

  const onDragEnd = (result) => {
    if (!result.destination) return;
    if (checked) setChecked(false);
    const itemId = Number(result.draggableId);
    const dest = result.destination.droppableId;
    const catId = dest === "pool" ? null : Number(dest.replace("cat-", ""));
    setPlacements((prev) => ({ ...prev, [itemId]: catId }));
  };

  const renderItem = (item, index) => {
    const correct = isCorrect(item);
    return <Draggable key={item.id} draggableId={String(item.id)} index={index}>
      {(provided) => <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className={`rounded-xl border-2 border-b-4 bg-white px-3 py-2.5 text-sm font-bold shadow-sm ${checked ? (correct ? "border-emerald-500" : "border-rose-500") : "border-slate-200 hover:border-sky-300"}`}>
        <div className="flex items-center gap-2">{checked && (correct ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> : <XCircle className="h-4 w-4 shrink-0 text-rose-500" />)}<span className="text-slate-700">{item.label}</span></div>
        {checked && <p className="mt-1.5 text-xs font-medium text-slate-500">{item.explanation}</p>}
      </div>}
    </Draggable>;
  };

  return <div className="mx-auto min-h-[calc(100vh-82px)] max-w-3xl px-5 py-8">
    <p className="mb-2 text-sm font-black uppercase tracking-widest text-emerald-600">Drag each item into a bucket</p>
    <h1 className="text-xl font-black leading-snug text-slate-800 sm:text-2xl">{question.heading}</h1>
    <p className="mb-6 mt-1 font-semibold text-slate-500">{question.body}</p>
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="mb-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4">
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-slate-400">Items to sort</p>
        <Droppable droppableId="pool" direction="horizontal">
          {(provided) => <div ref={provided.innerRef} {...provided.droppableProps} className="flex min-h-[3rem] flex-wrap gap-2.5">{poolItems.length === 0 ? <span className="text-sm font-semibold text-slate-400">All items placed</span> : poolItems.map(renderItem)}{provided.placeholder}</div>}
        </Droppable>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">{question.categories.map((cat) => { const items = bucketItems(cat.id); const correctInBucket = items.filter(isCorrect).length; return <Droppable key={cat.id} droppableId={`cat-${cat.id}`}>
        {(provided) => <div ref={provided.innerRef} {...provided.droppableProps} className={`flex min-h-[14rem] flex-col rounded-2xl border-2 border-b-4 p-3 ${checked ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50"}`}>
          <div className="mb-3 flex items-center justify-between"><h3 className="font-black text-slate-700">{cat.name}</h3>{checked && <span className={`text-xs font-black ${correctInBucket === items.length ? "text-emerald-600" : "text-rose-500"}`}>{correctInBucket}/{items.length}</span>}</div>
          <div className="flex flex-1 flex-col gap-2.5">{items.map(renderItem)}{items.length === 0 && <span className="text-xs font-semibold text-slate-300">Drop here</span>}{provided.placeholder}</div>
        </div>}
      </Droppable>; })}</div>
    </DragDropContext>
    <div className="mt-8">{checked ? <button onClick={() => onContinue(allCorrect)} className={`w-full rounded-2xl border-b-4 px-5 py-3.5 font-black uppercase tracking-wide text-white active:translate-y-1 active:border-b-0 ${allCorrect ? "border-emerald-700 bg-emerald-500" : "border-rose-700 bg-rose-500"}`}>Continue</button> : <button disabled={!allPlaced} onClick={() => setChecked(true)} className="w-full rounded-2xl border-b-4 border-emerald-700 bg-emerald-500 px-5 py-3.5 font-black uppercase tracking-wide text-white disabled:border-slate-300 disabled:bg-slate-200 disabled:text-slate-400">Check answers</button>}</div>
  </div>;
}