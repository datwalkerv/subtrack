"use client";

import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";
import DashboardHeader from "@/components/shared/Header";
import { createSubscription } from "@/actions/subscriptionsActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddSubscriptionPage({settings}: {settings: any}) {
  const router = useRouter();

  const currency = settings?.currency || "HUF";

  const [subscription, setSubscription] = useState("");
  const [cost, setCost] = useState("");
  const [billingInterval, setBillingInterval] = useState("1");
  const [billingPeriod, setBillingPeriod] = useState("Month");
  const [nextPaymentDate, setNextPaymentDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [category, setCategory] = useState("none");
  const [paymentMethod, setPaymentMethod] = useState("none");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showDetails, setShowDetails] = useState(false);

  const handleSave = () => {
    const formData = new FormData();
    formData.append("subscription", subscription);
    formData.append("cost", cost);
    formData.append("currency", currency);
    formData.append("billingInterval", billingInterval);
    formData.append("billingPeriod", billingPeriod);
    formData.append("nextPaymentDate", nextPaymentDate);
    formData.append("category", category !== "none" ? category : "");
    formData.append(
      "paymentMethod",
      paymentMethod !== "none" ? paymentMethod : ""
    );
    formData.append("startDate", startDate);
    if (endDate) formData.append("endDate", endDate);
    if (url) formData.append("url", url);
    if (notes) formData.append("notes", notes);
    formData.append("status", "active");

    startTransition(async () => {
      const response = await createSubscription(formData);
      if (response.success) {
        toast.success("Subscription created successfully!");
        router.push("/subscriptions");
        router.refresh();
      } else {
        toast.error("Failed to create subscription");
      }
    });
  };

  return (
    <div className="p-8 flex flex-col gap-6 mx-auto mt-0 mb-auto w-full max-w-3xl">
      <DashboardHeader />

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Add Subscription</h1>
        <p className="text-sm text-white/50">
          Enter your subscription details below.
        </p>
      </div>

      {/* Add Subscription Card */}
      <Card className="bg-white/5 border border-white/10 rounded-2xl p-6 text-white">
        <CardContent className="flex flex-col gap-5 p-0">
          {/* Subscription Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Subscription</label>
            <Input
              placeholder="Enter subscription name"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              value={subscription}
              onChange={(e) => setSubscription(e.target.value)}
            />
          </div>

          {/* Cost */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Cost {currency}</label>
            <Input
              type="number"
              placeholder="Amount"
              className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>

          {/* Period */}
          <div className="flex flex-col gap-2">
            <label className="text-sm text-white/70">Billing Period</label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                className="w-20 bg-white/5 border-white/10 text-white"
                value={billingInterval}
                onChange={(e) => setBillingInterval(e.target.value)}
              />
              <div className="flex gap-2">
                {["Day", "Week", "Month", "Year"].map((period) => (
                  <Button
                    key={period}
                    type="button"
                    className={`px-4 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 ${
                      period === "Month" && "bg-white/20 text-white"
                    }`}
                    onClick={() => setBillingPeriod(period)}
                  >
                    {period}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Next Payment Date */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Next Payment Date</label>
            <Input
              type="date"
              className="bg-white/5 border-white/10 text-white"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-white/70">Category</label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="personalcare">Personal Care</SelectItem>
                <SelectItem value="food">Food</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
                <SelectItem value="health">Health</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Toggle Details */}
          <button
            type="button"
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm flex items-center gap-1 text-white/60 hover:text-white/80 mt-1"
          >
            {showDetails ? "Hide additional details" : "Enter more details"}
            {showDetails ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {/* Additional Details */}
          {showDetails && (
            <div className="flex flex-col gap-5 mt-2 border-t border-white/10 pt-5">
              {/* Payment Method */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-white/70">Payment Method</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="None" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a1a] border-white/10 text-white">
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="revolut">Revolut</SelectItem>
                    <SelectItem value="wise">Wise</SelectItem>
                    <SelectItem value="otp">OTP</SelectItem>
                    <SelectItem value="bcr">BCR</SelectItem>
                    <SelectItem value="btpay">BT Pay</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start & End Date */}
              <div className="flex gap-4">
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="text-sm text-white/70">Start Date</label>
                  <Input
                    type="date"
                    className="bg-white/5 border-white/10 text-white"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-1 w-1/2">
                  <label className="text-sm text-white/70">End Date</label>
                  <Input
                    type="date"
                    className="bg-white/5 border-white/10 text-white"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>

              {/* URL */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-white/70">URL</label>
                <Input
                  type="url"
                  placeholder="https://"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-1">
                <label className="text-sm text-white/70">Notes</label>
                <Textarea
                  placeholder="Additional notes about this subscription"
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-white/40">
                  Do not include sensitive information
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              className="bg-white/10 hover:bg-white/20 border border-white/10 text-white"
              onClick={handleSave}
              disabled={isPending}
            >
              Create Subscription
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
