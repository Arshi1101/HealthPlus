"use client";

const moods = [
  { label: "Happy", color: "bg-yellow-400" },
  { label: "Sad", color: "bg-blue-400" },
  { label: "Angry", color: "bg-red-500" },
  { label: "Calm", color: "bg-green-600" },
];

export default function MoodPicker({ selectedMood, setSelectedMood }) {
  return (
    <div className="flex gap-3 mt-3">
      {moods.map((m) => (
        <button
          key={m.label}
          className={`px-3 py-1 rounded-full text-sm font-medium ${m.color} ${
            selectedMood === m.label ? "ring-2 ring-white" : ""
          }`}
          onClick={() => setSelectedMood(m.label)}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}