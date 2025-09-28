"use client";

import { useState, useEffect } from "react";

const moods = [
  { label: "Happy", value: "happy", color: "bg-yellow-400/40" },
  { label: "Sad", value: "sad", color: "bg-blue-500/40" },
  { label: "Calm", value: "calm", color: "bg-green-400/40" },
  { label: "Angry", value: "angry", color: "bg-red-500/40" },
  ];

export default function EntryForm({ entry, onSave, onDelete }) {
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");

  useEffect(() => {
    setText(entry?.text || "");
    setMood(entry?.mood || "");
  }, [entry]);

  return (
    <div className="flex flex-col gap-4">
      <textarea
        className="w-full h-40 p-4 rounded-xl bg-black/10 border border-black text-white resize-none focus:ring-2 focus:ring-purple-400 transition"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your thoughts..."
      />

      {/* Mood Picker */}
      <div className="flex gap-2 flex-wrap">
        {moods.map((m) => (
          <button
            key={m.value}
            onClick={() => setMood(m.value)}
            className={`px-4 py-2 rounded-full font-medium transition
              ${m.color} ${mood === m.value ? "ring-2 ring-white" : ""}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <button
          onClick={() => onSave(text, mood)}
          className="px-5 py-2 w-1/2 rounded-lg bg-purple-500 hover:bg-purple-600 font-bold transition"
        >
          Save Entry
        </button>
        {entry && (
          <button
            onClick={onDelete}
            className="px-5 w-1/2 py-2 rounded-lg bg-red-500 hover:bg-red-600 font-bold transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}