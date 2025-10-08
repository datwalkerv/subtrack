"use server";

import { auth, db } from "@/lib/auth/auth";
import {
  getCurrentUser,
  isAuthenticated,
  notAuthenticatedObject,
} from "@/lib/auth/auth-functions";
import { settingsSchema } from "@/lib/validation/settingSchema";
import { set } from "better-auth";
import { create } from "domain";

export async function getSettings() {
  try {
    const valid = await isAuthenticated();
    const user = await getCurrentUser();
    if (!valid || !user) return { success: false, error: "Failed to fetch settings", setting: null };

    const settings = await db
      .collection("settings")
      .findOne({ userId: user.id });

    const parsedSettings = settingsSchema.parse(settings || {});

    return { success: true, setting: parsedSettings };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return { success: false, error: "Failed to fetch settings", setting: null };
  }
}

export async function checkSettings() {
  try {
    const valid = await isAuthenticated();
    const user = await getCurrentUser();
    if (!valid || !user) return notAuthenticatedObject;
    
    const existingSettings = await db
      .collection("settings")
      .findOne({ userId: user.id });

    if (!existingSettings) {
      return { success: false, data: existingSettings };
    }

    return { success: true, data: existingSettings };
  } catch (error) {
    console.error("Error checking settings:", error);
    return { success: false, error: "Failed to check settings" };
  }
}

export async function updateSettings(formData: FormData) {
  try {
    const valid = await isAuthenticated();
    const user = await getCurrentUser();
    if (!valid || !user) return notAuthenticatedObject;

    const raw = {
      timezone: formData.get("timezone"),
      currency: formData.get("currency"),
    };

    const parsed = settingsSchema.parse(raw);
    const now = new Date();

    await db.collection("settings").updateOne(
      { userId: user.id },
      {
        $set: {
          ...parsed,
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true }
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
