"use client";

import {
  Users,
  BookOpen,
  CreditCard,
  ClipboardList,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAdminData } from "@/hooks/useAdminData";
import { MetricCard } from "@/components/admin/MetricCard";
import { ActivityList } from "@/components/admin/ActivityList";
import { TrendChart } from "@/components/admin/TrendChart";

export default function AdminOverview() {
  const { metrics, activities, chartData, loading, error, refetch } =
    useAdminData();

  if (error) {
    return (
      <main className="space-y-10">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Admin Overview
        </h1>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Failed to load admin data: {error}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={refetch}
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </main>
    );
  }

  return (
    <main className="space-y-10">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          Admin Overview
        </h1>
        <Button
          variant="outline"
          size="sm"
          onClick={refetch}
          disabled={loading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </header>

      {/* Metrics */}
      <section
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Key metrics overview"
      >
        <MetricCard
          title="Users"
          value={metrics?.users ?? 0}
          icon={Users}
          href="/admin/users"
          isLoading={loading}
        />
        <MetricCard
          title="Courses"
          value={metrics?.courses ?? 0}
          icon={BookOpen}
          href="/admin/courses"
          isLoading={loading}
        />
        <MetricCard
          title="Enrollments"
          value={metrics?.enrollments ?? 0}
          icon={ClipboardList}
          href="/admin/enrollments"
          isLoading={loading}
        />
        <MetricCard
          title="Payments"
          value={`£${metrics?.payments ?? 0}`}
          icon={CreditCard}
          href="/admin/payments"
          isLoading={loading}
        />
      </section>

      {/* Chart */}
      <section aria-label="Enrollment and revenue trends">
        <TrendChart chartData={chartData} isLoading={loading} />
      </section>

      {/* Recent Activities */}
      <section aria-label="Recent activities">
        <ActivityList activities={activities} isLoading={loading} />
      </section>
    </main>
  );
}
