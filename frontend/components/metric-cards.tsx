import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, TrendingUp, Gauge, Target, Clock, TrendingDown, Minus } from "lucide-react"

interface MetricCardsProps {
  tasksCompleted: number
  tasksInProgress: number
  productivity: number
  efficiency: number
  utilization: number
}

export function MetricCards({
  tasksCompleted,
  tasksInProgress,
  productivity,
  efficiency,
  utilization,
}: MetricCardsProps) {
  const productivityTrend = 8 // +8% improvement
  const efficiencyTrend = -2 // -2% decline
  const utilizationTrend = 0 // no change

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <TrendingUp className="h-3 w-3 text-[hsl(var(--alert-success))]" />
    if (trend < 0) return <TrendingDown className="h-3 w-3 text-[hsl(var(--alert-error))]" />
    return <Minus className="h-3 w-3 text-muted-foreground" />
  }

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-[hsl(var(--alert-success))]"
    if (trend < 0) return "text-[hsl(var(--alert-error))]"
    return "text-muted-foreground"
  }

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      <Card className="border-border/50 hover:border-primary/50 transition-colors">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col items-center text-center space-y-1">
            <CheckCircle2 className="h-6 w-6 text-[hsl(var(--alert-success))] mb-1" />
            <p className="text-xs text-muted-foreground">Tasks Completed</p>
            <p className="text-2xl font-bold">{tasksCompleted}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 hover:border-primary/50 transition-colors">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col items-center text-center space-y-1">
            <TrendingUp className="h-6 w-6 text-[hsl(var(--alert-warning))] mb-1" />
            <p className="text-xs text-muted-foreground">Tasks In-progress</p>
            <p className="text-2xl font-bold">{tasksInProgress}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 hover:border-primary/50 transition-colors">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col items-center text-center space-y-1">
            <Gauge className="h-6 w-6 text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Productivity</p>
            <p className="text-2xl font-bold">{productivity.toFixed(1)}</p>
            <div className="flex items-center gap-1">
              {getTrendIcon(productivityTrend)}
              <span className={`text-xs font-medium ${getTrendColor(productivityTrend)}`}>
                {productivityTrend > 0 ? "+" : ""}
                {productivityTrend}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 hover:border-primary/50 transition-colors">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col items-center text-center space-y-1">
            <Target className="h-6 w-6 text-primary mb-1" />
            <p className="text-xs text-muted-foreground">Efficiency</p>
            <p className="text-2xl font-bold">{efficiency}%</p>
            <div className="flex items-center gap-1">
              {getTrendIcon(efficiencyTrend)}
              <span className={`text-xs font-medium ${getTrendColor(efficiencyTrend)}`}>
                {efficiencyTrend > 0 ? "+" : ""}
                {efficiencyTrend}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50 hover:border-primary/50 transition-colors">
        <CardContent className="pt-4 pb-4">
          <div className="flex flex-col items-center text-center space-y-1">
            <Clock className="h-6 w-6 text-[#8b5cf6] mb-1" />
            <p className="text-xs text-muted-foreground">Utilization</p>
            <p className="text-2xl font-bold">{utilization}%</p>
            <div className="flex items-center gap-1">
              {getTrendIcon(utilizationTrend)}
              <span className={`text-xs font-medium ${getTrendColor(utilizationTrend)}`}>No change</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
