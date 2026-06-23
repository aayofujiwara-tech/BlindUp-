import { useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { Level } from "@/lib/presets";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  levels: Level[];
  onChange: (levels: Level[]) => void;
}

function SortableRow({
  level,
  index,
  id,
  onChange,
  onDelete,
  t,
}: {
  level: Level;
  index: number;
  id: string;
  onChange: (idx: number, field: keyof Level, value: string | number) => void;
  onDelete: (idx: number) => void;
  t: (key: string) => string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-white/10 hover:bg-white/5">
      <td className="px-2 py-1 text-center cursor-grab" {...attributes} {...listeners}>⠿</td>
      <td className="px-2 py-1 text-center text-sm opacity-50">{index + 1}</td>
      <td className="px-2 py-1">
        <select
          value={level.type}
          onChange={(e) => onChange(index, "type", e.target.value)}
          className="bg-transparent border border-white/20 rounded px-1 py-0.5 text-sm w-full"
        >
          <option value="blind">{t("blind")}</option>
          <option value="break">{t("break")}</option>
        </select>
      </td>
      {level.type === "blind" ? (
        <>
          <td className="px-1 py-1">
            <input type="number" value={level.sb ?? ""} onChange={(e) => onChange(index, "sb", Number(e.target.value))} className="bg-transparent border border-white/20 rounded px-1 py-0.5 text-sm w-full text-right" />
          </td>
          <td className="px-1 py-1">
            <input type="number" value={level.bb ?? ""} onChange={(e) => onChange(index, "bb", Number(e.target.value))} className="bg-transparent border border-white/20 rounded px-1 py-0.5 text-sm w-full text-right" />
          </td>
          <td className="px-1 py-1">
            <input type="number" value={level.ante ?? ""} onChange={(e) => onChange(index, "ante", e.target.value === "" ? 0 : Number(e.target.value))} className="bg-transparent border border-white/20 rounded px-1 py-0.5 text-sm w-full text-right" />
          </td>
        </>
      ) : (
        <td colSpan={3} className="px-2 py-1 text-center text-sm opacity-40">{t("break")}</td>
      )}
      <td className="px-1 py-1">
        <input type="number" value={level.duration} onChange={(e) => onChange(index, "duration", Number(e.target.value))} className="bg-transparent border border-white/20 rounded px-1 py-0.5 text-sm w-full text-right" />
      </td>
      <td className="px-2 py-1 text-center">
        <button onClick={() => onDelete(index)} className="text-red-400 hover:text-red-300 text-lg leading-none">×</button>
      </td>
    </tr>
  );
}

export default function LevelEditor({ levels, onChange }: Props) {
  const { t } = useTranslation("setup");
  const sensors = useSensors(useSensor(PointerSensor));
  const idRef = useRef<string[]>(levels.map((_, i) => `lvl-${i}-${Date.now()}`));

  while (idRef.current.length < levels.length) {
    idRef.current.push(`lvl-${idRef.current.length}-${Date.now()}`);
  }
  const rowIds = idRef.current.slice(0, levels.length);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = rowIds.indexOf(String(active.id));
      const newIndex = rowIds.indexOf(String(over.id));
      const newIds = arrayMove([...idRef.current], oldIndex, newIndex);
      idRef.current = newIds;
      onChange(arrayMove(levels, oldIndex, newIndex));
    }
  };

  const handleChange = useCallback((idx: number, field: keyof Level, value: string | number) => {
    onChange(levels.map((l, i) => (i === idx ? { ...l, [field]: value } : l)));
  }, [levels, onChange]);

  const handleDelete = (idx: number) => {
    idRef.current = idRef.current.filter((_, i) => i !== idx);
    onChange(levels.filter((_, i) => i !== idx));
  };

  const addLevel = (type: "blind" | "break") => {
    idRef.current.push(`lvl-${Date.now()}`);
    onChange([
      ...levels,
      type === "blind"
        ? { type: "blind", sb: 100, bb: 200, ante: 0, duration: 15 }
        : { type: "break", duration: 10 },
    ]);
  };

  return (
    <div className="overflow-x-auto">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="text-left text-xs opacity-50 uppercase">
              <th className="px-2 pb-2 w-6"></th>
              <th className="px-2 pb-2 w-8">{t("levelNum")}</th>
              <th className="px-2 pb-2 w-24">{t("typeLabel")}</th>
              <th className="px-1 pb-2 w-20">{t("sbLabel")}</th>
              <th className="px-1 pb-2 w-20">{t("bbLabel")}</th>
              <th className="px-1 pb-2 w-20">{t("anteLabel")}</th>
              <th className="px-1 pb-2 w-20">{t("durationLabel")}</th>
              <th className="px-2 pb-2 w-8"></th>
            </tr>
          </thead>
          <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
            <tbody>
              {levels.map((level, i) => (
                <SortableRow
                  key={rowIds[i]}
                  id={rowIds[i]}
                  level={level}
                  index={i}
                  onChange={handleChange}
                  onDelete={handleDelete}
                  t={t as (key: string) => string}
                />
              ))}
            </tbody>
          </SortableContext>
        </table>
      </DndContext>
      <div className="flex gap-2 mt-3">
        <button onClick={() => addLevel("blind")} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition">
          + {t("addLevel")}
        </button>
        <button onClick={() => addLevel("break")} className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition">
          + {t("addBreak")}
        </button>
      </div>
    </div>
  );
}
