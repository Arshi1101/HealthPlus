"use client";

export default function Calendar({ selectedDate, setSelectedDate, entries }) {
  const today = new Date();
  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const handleClick = (day) => {
    if (!day) return;
    setSelectedDate(new Date(year, month, day));
  };

  const moodColors = {
  happy: "bg-yellow-400",
  sad: "bg-blue-500",
  calm: "bg-green-600",
  angry: "bg-red-500"
};

  return (
    <div className="p-4 rounded-2xl  ">
      <h2 className="text-xl font-semibold text-cyan-400 text-center mb-4">
        {selectedDate.toLocaleString("default", { month: "long" })} {year}
      </h2>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-2 text-center font-medium text-gray-400 mb-2">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          if (!day) return <div key={idx}></div>;

          const dateStr = new Date(year, month, day).toDateString();
          const entry = entries[dateStr];
          const moodClass = entry?.mood ? moodColors[entry.mood] : "bg-gray-800";

          const isSelected =
            day === selectedDate.getDate() &&
            month === selectedDate.getMonth() &&
            year === selectedDate.getFullYear();

          return (
            <button
              key={idx}
              onClick={() => handleClick(day)}
              className={`h-12 w-12 flex items-center justify-center rounded-lg transition 
                ${isSelected ? "ring-2 ring-cyan-400" : ""} 
                ${moodClass} hover:ring-2 hover:ring-white`}
            >
              <span className="text-white font-semibold">{day}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}