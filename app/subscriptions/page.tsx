"use client";

import { useState } from "react";
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
import { Plus, Pencil, Trash2 } from "lucide-react";
import DashboardHeader from "@/components/shared/Header";
import Link from "next/link";

export default function SubscriptionsPage() {
  const [search, setSearch] = useState("");

  const [subscriptions, setSubscriptions] = useState([
    {
      id: 1,
      name: "tiktask",
      category: "Banking/Credit Cards",
      cost: 234.0,
      billing: "Monthly",
      nextBill: "Nov 4, 2025",
      daysRemaining: 30,
      status: "Active",
    },
  ]);

  const handleDelete = (id: number) => {
    setSubscriptions((subs) => subs.filter((sub) => sub.id !== id));
  };

  const filtered = subscriptions.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col p-8 my-12 gap-8 mx-auto mt-0 mb-auto">
      <DashboardHeader name="Balint" />

      {/* Page Header */}
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-2xl font-semibold text-white">Subscriptions</h1>
          <p className="text-sm text-white/50">
            A list of all your active subscriptions.
          </p>
        </div>
        <Link href="/subscriptions/new"><Button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg">
          <Plus className="w-4 h-4" />
          Add Subscription
        </Button></Link>
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
          €{filtered.reduce((acc, sub) => acc + sub.cost, 0).toFixed(2)}
        </p>
      </div>

      {/* Subscription list */}
      {filtered.map((sub) => (
        <Card key={sub.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-sm">
          <CardContent className="flex items-center justify-between p-0">
            <div className="flex items-center gap-4">
              <div className="h-10 w-1.5 rounded bg-purple-600" />
              <div>
                <h3 className="font-medium">{sub.name}</h3>
                <p className="text-sm text-muted-foreground">{sub.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-12 text-sm">
              <div className="min-w-[80px] text-right">
                <p className="font-medium">€{sub.cost.toFixed(2)}</p>
              </div>
              <div className="min-w-[80px] text-right">{sub.billing}</div>
              <div className="min-w-[140px] text-right">
                <p>{sub.nextBill}</p>
                <p className="text-xs text-muted-foreground">
                  {sub.daysRemaining} days from now
                </p>
              </div>
              <div className="min-w-[80px] text-right">
                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  {sub.status}
                </Badge>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Pencil className="w-4 h-4 cursor-pointer hover:text-primary" />
                <Trash2
                  className="w-4 h-4 cursor-pointer hover:text-red-600"
                  onClick={() => handleDelete(sub.id)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
