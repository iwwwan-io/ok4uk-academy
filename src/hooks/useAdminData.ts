import { useState, useEffect } from "react";
import {
  getAdminMetrics,
  getAdminActivities,
  getAdminChartData,
  Activity,
} from "@/query/getAdminData";

export function useAdminData() {
  const [metrics, setMetrics] = useState<{
    users: number;
    courses: number;
    enrollments: number;
    payments: number;
  } | null>(null);

  const [activities, setActivities] = useState<Array<Activity> | null>(null);

  const [chartData, setChartData] = useState<Array<{
    month: string;
    enrollments: number;
    revenue: number;
  }> | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [metricsData, activitiesData, chartDataResult] = await Promise.all([
        getAdminMetrics(),
        getAdminActivities(10),
        getAdminChartData(),
      ]);

      setMetrics(metricsData);
      setActivities(activitiesData);
      setChartData(chartDataResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return {
    metrics,
    activities,
    chartData,
    loading,
    error,
    refetch,
  };
}
