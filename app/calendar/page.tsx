"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import DashboardHeader from "@/components/shared/Header";
import {
  getSubscriptions,
  updateExpiredSubscriptions,
} from "@/actions/subscriptionsActions";

export default function SubscriptionCalendar() {
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    setCurrentMonth(new Date());

    const init = async () => {
      await updateExpiredSubscriptions();
      const res = await getSubscriptions();
      if (res?.success && Array.isArray(res.data)) {
        setSubscriptions(res.data);
      }
    };

    init();
  }, []);

  if (!currentMonth) return null;

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
  const firstDayIndex = (startOfMonth.getDay() + 6) % 7;

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

  const totalDue = subscriptions
    .filter((s) => {
      const date = new Date(s.nextPaymentDate);
      return (
        date.getFullYear() === currentMonth.getFullYear() &&
        date.getMonth() === currentMonth.getMonth()
      );
    })
    .reduce((sum, s) => sum + Number(s.cost || 0), 0);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const currency = subscriptions[0]?.currency || "HUF";

  return (
    <div className="p-8 flex flex-col gap-6 mx-auto mt-0 mb-auto w-full max-w-5xl">
      <DashboardHeader />

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
            <span className="text-white font-semibold">
              {totalDue.toFixed(2)}
              {currency}
            </span>
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
          {weekDays.map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-white">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-20 bg-transparent"></div>
          ))}

          {Array.from({ length: daysInMonth }).map((_, dayIndex) => {
            const date = new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              dayIndex + 1
            );
            const subsToday = subscriptions.filter((s) => {
              const payDate = new Date(s.nextPaymentDate);
              return payDate.toDateString() === date.toDateString();
            });
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={dayIndex}
                className={`min-h-20 flex flex-col gap-1 border border-white/10 rounded-md p-2 items-start justify-start text-sm relative ${
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
                    key={s._id}
                    className="mt-1 text-xs px-2 py-1 bg-white/10 border border-white/10 rounded-md truncate w-full text-left"
                  >
                    {s.subscription}
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
