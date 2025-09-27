import { supabase } from "@/lib/supabase/client";

export async function getAdminMetrics() {
  // Get user count
  const { count: usersCount, error: usersError } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  if (usersError) throw usersError;

  // Get course count
  const { count: coursesCount, error: coursesError } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });

  if (coursesError) throw coursesError;

  // Get enrollment count
  const { count: enrollmentsCount, error: enrollmentsError } = await supabase
    .from("enrollments")
    .select("*", { count: "exact", head: true });

  if (enrollmentsError) throw enrollmentsError;

  // Get total payments amount
  const { data: paymentsData, error: paymentsError } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "succeeded");

  if (paymentsError) throw paymentsError;

  const paymentsTotal =
    paymentsData?.reduce((sum, payment) => {
      return (
        sum +
        (typeof payment.amount === "number"
          ? payment.amount
          : parseFloat(payment.amount) || 0)
      );
    }, 0) || 0;

  return {
    users: usersCount || 0,
    courses: coursesCount || 0,
    enrollments: enrollmentsCount || 0,
    payments: paymentsTotal,
  };
}

export type Activity =
  | {
      id: string;
      type: "enrollment";
      message: string;
      timestamp: string;
      status: string | null;
    }
  | {
      id: string;
      type: "payment";
      message: string;
      timestamp: string;
      status: string | null;
    };

export async function getAdminActivities(limit = 10) {
  // Get recent enrollments
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("enrollments")
    .select(
      `
      id,
      created_at,
      status,
      profiles!user_id (
        name,
        email
      ),
      courses!course_id (
        title
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (enrollmentsError) throw enrollmentsError;

  // Get recent payments
  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select(
      `
      id,
      created_at,
      amount,
      status,
      profiles!user_id (
        name,
        email
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (paymentsError) throw paymentsError;

  const activities: Activity[] = [
    ...(enrollments || []).map((enrollment) => ({
      id: `enrollment-${enrollment.id}`,
      type: "enrollment" as const,
      message: `${
        enrollment.profiles?.[0]?.name ||
        enrollment.profiles?.[0]?.email ||
        "User"
      } enrolled in ${enrollment.courses?.[0].title || "a course"}`,
      timestamp: enrollment.created_at ?? new Date().toISOString(),
      status: enrollment.status ?? null,
    })),
    ...(payments || []).map((payment) => {
      const amount =
        typeof payment.amount === "number"
          ? payment.amount
          : parseFloat(payment.amount as string) || 0;

      return {
        id: `payment-${payment.id}`,
        type: "payment" as const,
        message: `${
          payment.profiles?.[0].name || payment.profiles?.[0].email || "User"
        } made a payment of £${amount}`,
        timestamp: payment.created_at ?? new Date().toISOString(),
        status: payment.status ?? null,
      };
    }),
  ].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return activities.slice(0, limit);
}

export async function getAdminChartData() {
  // Get enrollment data for the last 12 months
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("enrollments")
    .select("created_at")
    .gte("created_at", twelveMonthsAgo.toISOString())
    .order("created_at");

  if (enrollmentsError) throw enrollmentsError;

  // Get payment data for the last 12 months
  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select("created_at, amount")
    .eq("status", "succeeded")
    .gte("created_at", twelveMonthsAgo.toISOString())
    .order("created_at");

  if (paymentsError) throw paymentsError;

  // Group by month
  const monthlyData = new Map<
    string,
    { month: string; enrollments: number; revenue: number }
  >();

  // Initialize last 12 months
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const key = date.toISOString().slice(0, 7); // YYYY-MM
    monthlyData.set(key, { month: key, enrollments: 0, revenue: 0 });
  }

  // Count enrollments per month
  enrollments?.forEach((enrollment) => {
    const month = enrollment.created_at?.slice(0, 7);
    if (monthlyData.has(String(month))) {
      monthlyData.get(String(month))!.enrollments++;
    }
  });

  // Sum revenue per month
  payments?.forEach((payment) => {
    const month = payment.created_at?.slice(0, 7);
    if (monthlyData.has(String(month))) {
      const amount =
        typeof payment.amount === "number"
          ? payment.amount
          : parseFloat(payment.amount) || 0;
      monthlyData.get(String(month))!.revenue += amount;
    }
  });

  return Array.from(monthlyData.values());
}
