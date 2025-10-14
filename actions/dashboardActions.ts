"use server";

import { getSubscriptions } from "@/actions/subscriptionsActions";

function normalizeDate(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addMonths(origDate: Date, months: number): Date {
  const d = new Date(origDate);
  const day = d.getDate();
  d.setMonth(d.getMonth() + months);
  if (d.getDate() < day) d.setDate(0);
  return d;
}

export async function getDashboardStats() {
  const response = await getSubscriptions();

  if (!response.success || !Array.isArray(response.data)) {
    console.error("❌ Failed to fetch subscriptions.");
    return null;
  }

  const subscriptions = response.data;
  const now = new Date();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
  const nextMonth = nextMonthDate.getMonth();
  const nextMonthYear = nextMonthDate.getFullYear();

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const nextMonthStart = new Date(nextMonthYear, nextMonth, 1);
  const nextMonthEnd = new Date(nextMonthYear, nextMonth + 1, 0);

  const activeCount = subscriptions.filter((sub) => {
    const endDate = sub.endDate ? new Date(sub.endDate) : null;
    return !endDate || endDate > now;
  }).length;

  const addedThisMonthCount = subscriptions.filter((sub) => {
    const createdAt = new Date(sub.createdAt);
    return (
      createdAt.getMonth() === currentMonth &&
      createdAt.getFullYear() === currentYear
    );
  }).length;

  const remainingThisMonth = subscriptions.reduce((sum, sub) => {
    if (!sub.nextPaymentDate || !sub.cost) return sum;
    const nextPayment = new Date(sub.nextPaymentDate);
    const endDate = sub.endDate ? new Date(sub.endDate) : null;
    if (
      nextPayment >= today &&
      nextPayment >= currentMonthStart &&
      nextPayment <= currentMonthEnd &&
      (!endDate || endDate >= nextPayment)
    ) {
      return sum + Number(sub.cost || 0);
    }
    return sum;
  }, 0);

  const remainingNextMonth = subscriptions.reduce((sum, sub) => {
    if (!sub.nextPaymentDate || !sub.cost) return sum;
    const nextPayment = new Date(sub.nextPaymentDate);
    const endDate = sub.endDate ? new Date(sub.endDate) : null;
    if (
      nextPayment >= today &&
      nextPayment <= nextMonthEnd &&
      (!endDate || endDate >= nextPayment)
    ) {
      return sum + Number(sub.cost || 0);
    }
    return sum;
  }, 0);

  const in30DaysDate = new Date(today);
  in30DaysDate.setDate(in30DaysDate.getDate() + 30);

  const todayMid = normalizeDate(today);
  const in30DaysMid = normalizeDate(in30DaysDate);

   const renewalsIn30DaysList = subscriptions.filter((sub) => {
    if (!sub.nextPaymentDate) return false;
    const nextPayment = normalizeDate(new Date(sub.nextPaymentDate));
    const endDate = sub.endDate ? normalizeDate(new Date(sub.endDate)) : null;
    return (
      nextPayment >= todayMid &&
      nextPayment <= in30DaysMid &&
      (!endDate || endDate >= nextPayment)
    );
  });

  const renewalsIn30Days = renewalsIn30DaysList.length;
  const renewalsIn30DaysCost = renewalsIn30DaysList.reduce(
    (sum, sub) => sum + Number(sub.cost || 0),
    0
  );

  const windowEnd = addMonths(today, 12);
  let yearlyCost = 0;

  subscriptions.forEach((sub) => {
    if (!sub.nextPaymentDate || !sub.cost) return;
    const endDate = sub.endDate ? new Date(sub.endDate) : null;
    let paymentDate = new Date(sub.nextPaymentDate);

    let safety = 0;
    while (paymentDate < today && safety < 24) {
      paymentDate = addMonths(paymentDate, 1);
      safety++;
    }

    safety = 0;
    while (paymentDate <= windowEnd && safety < 24) {
      if (!endDate || endDate >= paymentDate) {
        if (paymentDate >= today && paymentDate <= windowEnd) {
          yearlyCost += Number(sub.cost || 0);
        }
      } else {
        break;
      }
      paymentDate = addMonths(paymentDate, 1);
      safety++;
    }
  });

  const currency = subscriptions[0]?.currency || "HUF";

  return {
    currency,
    activeCount,
    addedThisMonthCount,
    remainingThisMonth,
    remainingNextMonth,
    renewalsIn30Days,
    renewalsIn30DaysCost,
    yearlyCost,
    renewalsIn30DaysList,
  };
}
