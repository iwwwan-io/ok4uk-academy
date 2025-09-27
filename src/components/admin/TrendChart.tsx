import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface ChartData {
  month: string
  enrollments: number
  revenue: number
}

interface TrendChartProps {
  chartData: ChartData[] | null
  isLoading?: boolean
}

export function TrendChart({ chartData, isLoading }: TrendChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            No trend data available
          </p>
        </CardContent>
      </Card>
    )
  }

  const maxEnrollments = Math.max(...chartData.map(d => d.enrollments))
  const maxRevenue = Math.max(...chartData.map(d => d.revenue))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trends (Last 12 Months)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Enrollments Chart */}
          <div>
            <h4 className="text-sm font-medium mb-2">Enrollments</h4>
            <div className="flex items-end space-x-2 h-32">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{
                      height: maxEnrollments > 0 ? `${(data.enrollments / maxEnrollments) * 100}%` : '0%'
                    }}
                  />
                  <span className="text-xs text-muted-foreground mt-1">
                    {data.month.slice(5)} {/* Show MM part of YYYY-MM */}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue Chart */}
          <div>
            <h4 className="text-sm font-medium mb-2">Revenue (£)</h4>
            <div className="flex items-end space-x-2 h-32">
              {chartData.map((data, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-500 rounded-t"
                    style={{
                      height: maxRevenue > 0 ? `${(data.revenue / maxRevenue) * 100}%` : '0%'
                    }}
                  />
                  <span className="text-xs text-muted-foreground mt-1">
                    {data.month.slice(5)} {/* Show MM part of YYYY-MM */}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded" />
            <span className="text-sm">Enrollments</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span className="text-sm">Revenue</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
