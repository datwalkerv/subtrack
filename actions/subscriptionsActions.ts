"use server";

import { auth, db } from "@/lib/auth/auth";
import {
  getCurrentUser,
  isAuthenticated,
  notAuthenticatedObject,
} from "@/lib/auth/auth-functions";
import { subscriptionSchema } from "@/lib/validation/subscriptionSchema";
import { Currency } from "lucide-react";
import { ObjectId } from "mongodb";

export async function createSubscription(formData: FormData) {
  try {
    const valid = await isAuthenticated();
    const user = await getCurrentUser();
    if (!valid || !user) return notAuthenticatedObject;

    const rawData = {
      subscription: formData.get("subscription"),
      cost: formData.get("cost"),
      currency: formData.get("currency"),
      billingInterval: formData.get("billingInterval"),
      billingPeriod: formData.get("billingPeriod"),
      nextPaymentDate: formData.get("nextPaymentDate"),
      category: formData.get("category"),
      paymentMethod: formData.get("paymentMethod"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      url: formData.get("url"),
      notes: formData.get("notes"),
      status: formData.get("status") || "active",
    };

    const parsedData = subscriptionSchema.parse(rawData);
    const now = new Date();

    const subscriptionData = {
      ...parsedData,
      userId: user.id,
      createdAt: now,
      updatedAt: now,
    };

    try{
      const sub = await db.collection("subscriptions").insertOne(subscriptionData);
      return { success: true };
    } catch(err) {
      return { success: false, error: "Database insertion error" };
    }
    return { success: false };
  } catch (error) {
    console.error("Error creating subscription:", error);
    return { success: false, error: "Failed to create subscription" };
  }
}

export async function getSubscriptions() {
  try {
    const valid = await isAuthenticated();
    const user = await getCurrentUser();
    if (!valid || !user) return notAuthenticatedObject;

    const subscriptions = await db
      .collection("subscriptions")
      .find({ userId: user.id })
      .sort({ createdAt: -1 })
      .toArray();

     const plainSubscriptions = subscriptions.map((sub) => ({
      ...sub,
      _id: sub._id.toString(),
      userId: sub.userId?.toString?.() ?? sub.userId,
      createdAt: sub.createdAt?.toISOString?.() ?? sub.createdAt,
      updatedAt: sub.updatedAt?.toISOString?.() ?? sub.updatedAt,
      nextPaymentDate: sub.nextPaymentDate
        ? new Date(sub.nextPaymentDate).toISOString()
        : null,
      startDate: sub.startDate ? new Date(sub.startDate).toISOString() : null,
      endDate: sub.endDate ? new Date(sub.endDate).toISOString() : null,
      cost: sub.cost ? parseFloat(sub.cost) : null,
      currency: sub.currency || "HUF",
    }));

    return { success: true, data: plainSubscriptions };
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return { success: false, error: "Failed to fetch subscriptions" };
  }
}

export async function updateSubscription(id: string, formData: FormData) {
  try {
    const valid = await isAuthenticated();
    const user = await getCurrentUser();
    if (!valid || !user) return notAuthenticatedObject;

    const raw = {
      subscription: formData.get("subscription"),
      cost: formData.get("cost"),
      billingInterval: formData.get("billingInterval"),
      billingPeriod: formData.get("billingPeriod"),
      nextPaymentDate: formData.get("nextPaymentDate"),
      category: formData.get("category"),
      paymentMethod: formData.get("paymentMethod"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      url: formData.get("url"),
      notes: formData.get("notes"),
      status: formData.get("status"),
    };

    const data = subscriptionSchema.partial().parse(raw);
    const now = new Date();

    const result = await db.collection("subscriptions").updateOne(
      { _id: new ObjectId(id), userId: user.id },
      {
        $set: {
          ...data,
          updatedAt: now,
        },
      }
    );

    if (result.matchedCount === 0) {
      return { success: false, error: "Subscription not found" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating subscription:", error);
    return { success: false, error: "Failed to update subscription" };
  }
}

export async function deleteSubscription(id: string) {
  try {
    const valid = await isAuthenticated();
    const user = await getCurrentUser();
    if (!valid || !user) return notAuthenticatedObject;

    const result = await db.collection("subscriptions").deleteOne({
      _id: new ObjectId(id),
      userId: user.id,
    });

    if (result.deletedCount === 0) {
      return { success: false, error: "Subscription not found" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting subscription:", error);
    return { success: false, error: "Failed to delete subscription" };
  }
}

export async function updateExpiredSubscriptions() {
  try {
    const valid = await isAuthenticated();
    const user = await getCurrentUser();
    if (!valid || !user) {
      return { success: false, error: "Not authenticated" };
    }

    const today = new Date();

    const subs = await db
      .collection("subscriptions")
      .find({ userId: user.id })
      .toArray();

    let updatedCount = 0;

    for (const s of subs) {
      const nextPayment = s.nextPaymentDate
        ? new Date(s.nextPaymentDate)
        : null;
      const endDate = s.endDate ? new Date(s.endDate) : null;

      if (!nextPayment) continue;

      if (endDate && endDate < today) continue;

      if (nextPayment < today) {
        const newNextPayment = new Date(
          nextPayment.getFullYear(),
          nextPayment.getMonth() + 1,
          nextPayment.getDate()
        );

        await db.collection("subscriptions").updateOne(
          { _id: new ObjectId(s._id), userId: user.id },
          {
            $set: {
              nextPaymentDate: newNextPayment,
              updatedAt: new Date(),
            },
          }
        );
        updatedCount++;
      }
    }

    return {
      success: true,
      updatedCount,
      message:
        updatedCount > 0
          ? `✅ ${updatedCount} subscription date(s) updated`
          : "No expired subscriptions found",
    };
  } catch (err) {
    console.error("Error updating expired subscriptions:", err);
    return { success: false, error: "Server error" };
  }
}