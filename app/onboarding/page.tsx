"use client";

import { useState, useEffect, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getSettings, updateSettings } from "@/actions/settingsActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [timezone, setTimezone] = useState("Europe/Budapest");
  const [currency, setCurrency] = useState("HUF");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    const formData = new FormData();
    formData.append("timezone", timezone);
    formData.append("currency", currency);

    startTransition(async () => {
      const result = await updateSettings(formData);
      if (result.success) {
        toast.success("Settings updated successfully!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Failed to update settings.");
      }
    });
  };

  return (
    <div className="p-8 flex flex-col gap-6 mx-auto mt-0 mb-auto w-full max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm text-white/50">
          Manage your personal preferences below.
        </p>
      </div>

      <Card className="bg-white/5 border border-white/10 text-white rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">
            General Preferences
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Timezone */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-white/70">Timezone</Label>
            <Select
              value={timezone}
              onValueChange={(value) => setTimezone(value)}
            >
              <SelectTrigger className="bg-transparent border-white/20 text-white w-full">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 text-white border-white/10">
                <SelectItem value="Europe/Budapest">
                  🇭🇺 Hungary (Europe/Budapest)
                </SelectItem>
                <SelectItem value="Europe/Bucharest">
                  🇷🇴 Romania (Europe/Bucharest)
                </SelectItem>
                <SelectItem value="Europe/Kyiv">
                  🇺🇦 Ukraine (Europe/Kyiv)
                </SelectItem>
                <SelectItem value="Europe/Belgrade">
                  🇷🇸 Serbia (Europe/Belgrade)
                </SelectItem>
                <SelectItem value="Europe/Berlin">
                  🇩🇪 Germany (Europe/Berlin)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Currency */}
          <div className="flex flex-col gap-2">
            <Label className="text-sm text-white/70">Currency</Label>
            <Select
              value={currency}
              onValueChange={(value) => setCurrency(value)}
            >
              <SelectTrigger className="bg-transparent border-white/20 text-white w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 text-white border-white/10">
                <SelectItem value="HUF">🇭🇺 Hungarian Forint (HUF)</SelectItem>
                <SelectItem value="RON">🇷🇴 Romanian Leu (RON)</SelectItem>
                <SelectItem value="UAH">🇺🇦 Ukrainian Hryvnia (UAH)</SelectItem>
                <SelectItem value="RSD">🇷🇸 Serbian Dinar (RSD)</SelectItem>
                <SelectItem value="EUR">🇩🇪 Euro (EUR)</SelectItem>
                <SelectItem value="USD">🇺🇸 US Dollar (USD)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="bg-white/10 hover:bg-white/20 text-white rounded-lg"
            >
              {isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
