"use server";

import { auth, db } from "@/lib/auth/auth";
import {
  getCurrentUser,
  isAuthenticated,
  notAuthenticatedObject,
} from "@/lib/auth/auth-functions";
import { subscriptionSchema } from "@/lib/validation/subscriptionSchema";
import { ObjectId } from "mongodb";

export async function createSubscription(formData: FormData) {
  try {
    const valid = await isAuthenticated();
    const user = await getCurrentUser();
    if (!valid || !user) return notAuthenticatedObject;

    const rawData = {
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

    await db.collection("subscriptions").insertOne(subscriptionData);

    return { success: true, data: subscriptionData };
  } catch (error) {
    console.error("Error creating subscription:", error);
    return { success: false, error: "Failed to create subscription" };
  }
}

export async function getSubscriptions(formData: FormData) {
  try {
    const valid = await isAuthenticated();
    const user = await getCurrentUser();
    if (!valid || !user) return notAuthenticatedObject;

    const subscriptions = await db
      .collection("subscriptions")
      .find({ userId: user.id })
      .sort({ createdAt: -1 })
      .toArray();

    return { success: true, data: subscriptions };
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
