import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "@/query/getAdminData";

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

interface ActivityListProps {
  activities: Activity[] | null;
  isLoading?: boolean;
}

export function ActivityList({ activities, isLoading }: ActivityListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-2 w-2 rounded-full" />
              <div className="space-y-1 flex-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No recent activities
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4">
            <div
              className={`h-2 w-2 rounded-full mt-2 ${
                activity.type === "enrollment" ? "bg-blue-500" : "bg-green-500"
              }`}
            />
            <div className="flex-1 space-y-1">
              <p className="text-sm">{activity.message}</p>
              <p className="text-xs text-muted-foreground">
                {formatTimeAgo(new Date(activity.timestamp))}
              </p>
            </div>
            <Badge
              variant={
                activity.status === "active" || activity.status === "succeeded"
                  ? "default"
                  : "secondary"
              }
            >
              {activity.status}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
