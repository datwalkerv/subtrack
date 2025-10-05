"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import DashboardHeader from "@/components/shared/Header";

export default function SubscriptionCalendar() {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentMonth(new Date(2025, 9)); // October 2025
  }, []);

  if (!currentMonth) {
    return null; // avoid hydration mismatch by not rendering until ready
  }

  const subscriptions = [
    { id: 1, name: "tiktask", date: new Date(2025, 9, 4), amount: 12.99 },
  ];

  const startOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const endOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  );
  const daysInMonth = endOfMonth.getDate();
  const firstDayIndex = startOfMonth.getDay();

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const totalDue = subscriptions.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="p-8 flex flex-col gap-6 mx-auto mt-0 mb-auto w-full max-w-5xl">
      <DashboardHeader name="Balint" />

      <div>
        <h1 className="text-2xl font-semibold text-white">
          Subscription Calendar
        </h1>
        <p className="text-sm text-white/50">
          View your subscriptions by renewal date.
        </p>
      </div>

      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-4 rounded-md">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-white/70" />
          <h2 className="text-lg font-semibold text-white">{monthName}</h2>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-white/60">
            Remaining Dues:{" "}
            <span className="text-white font-semibold">€{totalDue.toFixed(2)}</span>
          </span>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1 text-sm bg-white/10 rounded-md hover:bg-white/20 text-white/80"
          >
            Today
          </button>
          <div className="flex gap-2">
            <button
              onClick={prevMonth}
              className="p-1.5 bg-white/5 rounded-md hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4 text-white/70" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 bg-white/5 rounded-md hover:bg-white/10"
            >
              <ChevronRight className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white/5 border border-white/10 rounded-md p-4">
        <div className="grid grid-cols-7 text-center text-sm text-white/60 mb-2">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-white">
          {/* Empty cells for alignment */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-20 bg-transparent"></div>
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
            const date = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              dayIndex + 1
            );
            const subsToday = subscriptions.filter(
              (s) => s.date.toDateString() === date.toDateString()
            );
            const isToday =
              date.toDateString() === new Date().toDateString();

            return (
              <div
                key={dayIndex}
                className={`h-20 border border-white/10 rounded-md p-2 flex flex-col items-start justify-start text-sm relative ${
                  isToday ? "bg-white/10" : "bg-transparent"
                }`}
              >
                <span
                  className={`text-white/60 text-xs ${
                    isToday && "font-bold text-white"
                  }`}
                >
                  {dayIndex + 1}
                </span>

                {subsToday.map((s) => (
                  <div
                    key={s.id}
                    className="mt-1 text-xs px-2 py-1 bg-white/10 border border-white/10 rounded-md truncate w-full text-left"
                  >
                    {s.name}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
