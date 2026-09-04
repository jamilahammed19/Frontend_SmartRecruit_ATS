import { useState, useEffect } from "react";
import { getMyInterviews } from "../../services/interviewService";

const COLOR_PALETTES = [
  {
    bg: "bg-blue-500",
    light: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
  },
  {
    bg: "bg-emerald-500",
    light: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
  },
  {
    bg: "bg-purple-500",
    light: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
  },
  {
    bg: "bg-rose-500",
    light: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-700",
  },
  {
    bg: "bg-amber-500",
    light: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
  },
  {
    bg: "bg-indigo-500",
    light: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
  },
  {
    bg: "bg-cyan-500",
    light: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
  },
  {
    bg: "bg-fuchsia-500",
    light: "bg-fuchsia-50",
    border: "border-fuchsia-200",
    text: "text-fuchsia-700",
  },
];

export default function HrCalendar() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const data = await getMyInterviews();
        const appsArray = Array.isArray(data) ? data : data.results || [];

        const coloredInterviews = appsArray.map((inv, index) => ({
          ...inv,
          theme: COLOR_PALETTES[index % COLOR_PALETTES.length],
        }));

        setInterviews(coloredInterviews);
      } catch (error) {
        console.error("Failed to load interviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const monthlyInterviews = interviews.filter((inv) => {
    const invDate = new Date(inv.scheduled_time);
    const isActive = ["interview_scheduled", "offered", "hired"].includes(
      inv.application_status,
    );
    return (
      isActive && invDate.getFullYear() === year && invDate.getMonth() === month
    );
  });

  const now = new Date();

  const upcomingMonthly = monthlyInterviews
    .filter((inv) => new Date(inv.scheduled_time) >= now)
    .sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));

  const pastMonthly = monthlyInterviews
    .filter((inv) => new Date(inv.scheduled_time) < now)
    .sort((a, b) => new Date(a.scheduled_time) - new Date(b.scheduled_time));

  const calendarGrid = Array(firstDayOfMonth).fill(null);
  for (let i = 1; i <= daysInMonth; i++) calendarGrid.push(i);

  const renderInterviewCard = (inv, isPast = false) => (
    <div
      key={inv.id}
      className={`p-4 rounded-xl border flex flex-col justify-between ${inv.theme.light} ${inv.theme.border} shadow-sm transition-transform ${isPast ? "opacity-70 grayscale-[20%]" : "hover:-translate-y-1"}`}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full shadow-sm ${inv.theme.bg}`}
            ></span>
            <span
              className={`text-xs font-black uppercase tracking-wider ${inv.theme.text}`}
            >
              {new Date(inv.scheduled_time).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
          <span
            className={`text-xs font-black bg-white px-2 py-1 rounded border shadow-sm ${inv.theme.text}`}
          >
            {new Date(inv.scheduled_time).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>

        <h4 className="font-bold text-slate-900 text-base mb-1">
          {inv.candidate_name}
        </h4>
        <p className={`text-xs font-semibold mb-3 ${inv.theme.text}`}>
          {inv.job_title}
        </p>
      </div>

      <div className="pt-3 border-t border-white/50 text-xs text-slate-600 font-medium space-y-1">
        <div className="flex items-center gap-2">
          <svg
            className="w-3.5 h-3.5 opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Duration: {inv.duration} minutes
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="w-3.5 h-3.5 opacity-70"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Location: {inv.location || "Virtual Meeting"}
        </div>
        {!isPast && inv.meeting_link && (
          <div className="flex items-center gap-2 mt-2">
            <a
              href={inv.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-block px-3 py-1.5 bg-white border shadow-sm rounded-lg font-bold hover:bg-slate-50 transition-colors ${inv.theme.text} border-current`}
            >
              Join Meeting
            </a>
          </div>
        )}
      </div>
    </div>
  );

  if (loading)
    return (
      <div className="p-10 text-center text-slate-500">Loading Calendar...</div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 font-sans">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Interactive Calendar
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Get a bird's-eye view of your recruitment schedule.
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-t-xl border border-slate-200 flex justify-between items-center shadow-sm">
        <button
          onClick={prevMonth}
          className="p-1.5 border rounded hover:bg-slate-50 transition-colors"
        >
          <svg
            className="w-5 h-5 text-slate-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-xl font-black text-slate-800">{monthName}</h2>
        <button
          onClick={nextMonth}
          className="p-1.5 border rounded hover:bg-slate-50 transition-colors"
        >
          <svg
            className="w-5 h-5 text-slate-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="bg-slate-200 border-x border-b border-slate-200 rounded-b-xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-7 gap-px">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="bg-slate-50 py-2 text-center text-[10px] font-black tracking-wider text-slate-500 uppercase"
            >
              {day}
            </div>
          ))}

          {calendarGrid.map((day, idx) => {
            const dayInterviews = day
              ? monthlyInterviews.filter(
                  (inv) => new Date(inv.scheduled_time).getDate() === day,
                )
              : [];

            return (
              <div
                key={idx}
                className={`min-h-[80px] bg-white p-1.5 flex flex-col ${day ? "hover:bg-slate-50 transition-colors cursor-pointer" : ""}`}
              >
                {day && (
                  <>
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday(day) ? "bg-blue-600 text-white shadow-sm" : "text-slate-700"}`}
                      >
                        {day}
                      </span>
                      {dayInterviews.length > 0 && (
                        <span className="text-[9px] font-bold text-slate-400">
                          {dayInterviews.length} events
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 overflow-y-auto max-h-[50px] scrollbar-hide pr-1">
                      {dayInterviews.map((inv) => {
                        const isPast = new Date(inv.scheduled_time) < now;
                        const time = new Date(
                          inv.scheduled_time,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        });
                        return (
                          <div
                            key={inv.id}
                            title={`${inv.candidate_name} - ${inv.job_title}`}
                            className={`text-[9px] px-1 py-0.5 rounded truncate shadow-sm font-medium text-white ${inv.theme.bg} ${isPast ? "opacity-50" : ""}`}
                          >
                            <span className="font-bold">{time}</span>{" "}
                            {inv.candidate_name.split(" ")[0]}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {monthlyInterviews.length === 0 ? (
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">
              Schedule Details for {monthName}
            </h3>
            <div className="bg-white p-6 text-center rounded-xl border border-slate-200 text-sm text-slate-500">
              No interviews scheduled for this month.
            </div>
          </div>
        ) : (
          <>
            {upcomingMonthly.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <h3 className="text-lg font-bold text-slate-800">
                    Upcoming This Month
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                    {upcomingMonthly.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {upcomingMonthly.map((inv) =>
                    renderInterviewCard(inv, false),
                  )}
                </div>
              </div>
            )}

            {pastMonthly.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                  <h3 className="text-lg font-bold text-slate-500">
                    Outdated / Completed This Month
                  </h3>
                  <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                    {pastMonthly.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pastMonthly.map((inv) => renderInterviewCard(inv, true))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
