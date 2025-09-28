"use client";

import { useState, useEffect } from "react";
import Calendar from "./components/calendar";
import EntryForm from "./components/entryform";
import { getJournalEntry, saveJournalEntry, deleteJournalEntry } from "./firebaseFunctions";

export default function DiaryPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entry, setEntry] = useState(null);
  const [entries, setEntries] = useState({});
  const [message, setMessage] = useState("");

  const today = new Date();
  const isToday = selectedDate.toDateString() === today.toDateString();
  const entryId = selectedDate.toDateString();

  // Load entry for selected date
  useEffect(() => {
    const fetchEntry = async () => {
      const data = await getJournalEntry(entryId);
      setEntry(data);
    };
    fetchEntry();
  }, [selectedDate]);

  // Load recent entries for calendar mood colors
  useEffect(() => {
    const fetchAllEntries = async () => {
      const dates = [];
      for (let i = 0; i < 30; i++) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        dates.push(d.toDateString());
      }

      const allEntries = {};
      for (const dateStr of dates) {
        const data = await getJournalEntry(dateStr);
        if (data) allEntries[dateStr] = data;
      }
      setEntries(allEntries);
    };
    fetchAllEntries();
  }, []);

  const handleSave = async (text, mood) => {
    await saveJournalEntry(entryId, { date: entryId, text, mood });
    setEntry({ date: entryId, text, mood });
    setEntries((prev) => ({ ...prev, [entryId]: { date: entryId, text, mood } }));
    setMessage("✨ Your journal has been saved!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDelete = async () => {
    await deleteJournalEntry(entryId);
    setEntry(null);
    setEntries((prev) => {
      const updated = { ...prev };
      delete updated[entryId];
      return updated;
    });
    setMessage("🗑️ Your journal has been deleted.");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative text-white"
      style={{
        background: `
          radial-gradient(circle at 20% 30%, rgba(255,105,180,0.25) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(138,58,206,0.25) 0%, transparent 50%),
          radial-gradient(circle at 50% 80%, rgba(0,202,255,0.2) 0%, transparent 40%),
          linear-gradient(to bottom, #0a0014 0%, #000000 100%)
        `
      }}
    >
      <h1 className="text-4xl font-bold text-center text-purple-400 mb-2">Dear Diary</h1>
      <p className="text-center text-gray-300 mb-6 text-lg">
        This is your safe place. Your thoughts are safe with us!
      </p>

      {message && (
        <div className="text-center text-cyan-400 font-medium mb-4">{message}</div>
      )}

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Calendar Card */}
        <div className="p-6 rounded-2xl flex flex-col bg-white/10 border border-black shadow-lg h-full">
          <div className="flex-1">
            <Calendar
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              entries={entries}
            />
          </div>
        </div>

        {/* Entry Form Card */}
        <div className="p-6 rounded-2xl flex flex-col bg-white/10 border border-black shadow-lg h-full">
          <div className="flex-1 flex flex-col">
            {isToday ? (
              <EntryForm entry={entry} onSave={handleSave} onDelete={handleDelete} />
            ) : (
              <p className="text-gray-400 text-center mt-5 flex-1 flex items-center justify-center">
                You can only write journal entries for today.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}