"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pause, Trash2, Loader2 } from "lucide-react";
import DashboardHeader from "@/components/shared/Header";
import Link from "next/link";
import {
  getSubscriptions,
  deleteSubscription,
} from "@/actions/subscriptionsActions";
import { toast } from "sonner";

type Subscription = {
  _id: string;
  subscription: string;
  category: string;
  cost: number;
  currency: string;
  billingInterval?: string;
  billingPeriod?: string;
  nextPaymentDate?: string;
  paymentMethod?: string;
  status: string;
  createdAt: string;
};

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  useEffect(() => {
    async function loadSubscriptions() {
      setLoading(true);
      try {
        const res = await getSubscriptions();
        if (res.success) {
          setSubscriptions((res.data as unknown as Subscription[]) ?? []);
        } else {
          toast.error("Failed to fetch subscriptions");
        }
      } catch (err) {
        toast.error("Something went wrong loading subscriptions");
      } finally {
        setLoading(false);
      }
    }

    loadSubscriptions();
  }, []);

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteSubscription(id);
      if (res.success) {
        setSubscriptions((subs) => subs.filter((s) => s._id !== id));
        toast.success("Subscription deleted");
      } else {
        toast.error("Failed to delete subscription");
      }
    });
  };

  const filtered = subscriptions.filter((sub) =>
    sub.subscription.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-white">
        <Loader2 className="animate-spin w-8 h-8 mb-4" />
        <p>Loading subscriptions...</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col p-8 my-12 gap-4 mx-auto mt-0 mb-auto">
      <DashboardHeader />

      {/* Page Header */}
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-2xl font-semibold text-white">Subscriptions</h1>
          <p className="text-sm text-white/50">
            A list of all your active subscriptions.
          </p>
        </div>
        <Link href="/subscriptions/new">
          <Button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg">
            <Plus className="w-4 h-4" />
            Add Subscription
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 w-full">
        <Input
          placeholder="Search subscriptions..."
          className="w-full md:w-72 bg-white/5 border-white/10 text-white placeholder:text-white/40"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select>
          <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 text-white border-white/10">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 text-white border-white/10">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="banking">Banking</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-40 bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="All Upcoming" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 text-white border-white/10">
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
        <Select>
          <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
            <SelectValue placeholder="All Payment Methods" />
          </SelectTrigger>
          <SelectContent className="bg-neutral-900 text-white border-white/10">
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Total summary */}
      <div className="flex justify-between items-center text-sm text-white/50 w-full">
        <p>
          {filtered.length} subscription{filtered.length !== 1 && "s"}
        </p>
        <p className="text-base font-semibold text-white/80">
          {filtered.reduce((acc, sub) => acc + sub.cost, 0).toFixed(2)}{" "}{filtered[0]?.currency ?? ""}
        </p>
      </div>

      {/* Subscription list */}
      {filtered.length === 0 ? (
        <div className="text-center text-white/50 mt-12">
          No subscriptions found.
        </div>
      ) : (
        filtered.map((sub) => (
        <Card
          key={sub._id}
          className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-sm"
        >
          <CardContent className="flex items-center justify-between p-0">
            <div className="flex items-center gap-4">
              <div className="h-10 w-1.5 rounded bg-purple-600" />
              <div>
                <h3 className="font-medium">{sub.subscription}</h3>
                <p className="text-sm text-muted-foreground">{sub.category || "Uncategorized"}</p>
              </div>
            </div>
            <div className="flex items-center gap-12 text-sm">
              <div className="min-w-[80px] text-right">
                <p className="font-medium">{sub.cost.toFixed(2)} {sub.currency}</p>
              </div>
              <div className="min-w-[80px] text-right">{sub.billingPeriod || "-"}</div>
              <div className="min-w-[140px] text-right">
                <p>{sub.nextPaymentDate
                      ? new Date(sub.nextPaymentDate).toLocaleDateString()
                      : "—"}</p>
              </div>
              <div className="min-w-[80px] text-right">
                <Badge className={
                      sub.status === "active"
                        ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                        : "bg-gray-200 text-gray-700"
                    }>
                  {sub.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                {/*<Pause className="w-4 h-4 cursor-pointer hover:text-primary" /> */}
                <Trash2
                  className={`w-4 h-4 cursor-pointer hover:text-red-600 ${
                      isPending ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  onClick={() => handleDelete(sub._id)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))
      )}
    </div>
  );
}
