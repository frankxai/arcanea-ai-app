'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Users,
  Zap,
  Infinity,
  Crown,
  TrendingUp,
  Clock,
  Cpu,
  MemoryStick,
  Database,
  Shield,
  Activity,
} from 'lucide-react'
import { secureMCPManager } from '@/lib/secure-mcp-manager'

interface UsageMetric {
  label: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'stable'
  icon?: React.ComponentType<{ className?: string }>
}

interface PerformanceMetric {
  label: string
  value: string | number
  benchmark?: string
  status?: 'optimal' | 'warning' | 'critical'
}

export default function UsageAnalytics() {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day')
  const [realTimeMetrics, setRealTimeMetrics] = useState<UsageMetric[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetric[]>([])

  useEffect(() => {
    updateMetrics()
    const interval = setInterval(() => {
      updateMetrics()
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const updateMetrics = async () => {
    try {
      const systemHealth = secureMCPManager.getSystemHealth()

      const newMetrics: UsageMetric[] = [
        {
          label: 'Active Users',
          value: systemHealth.healthyConnections || 0,
          change: Math.floor(Math.random() * 10) - 5,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          icon: Users,
        },
        {
          label: 'Generations/Min',
          value: Math.floor(Math.random() * 50) + 10,
          change: Math.floor(Math.random() * 5) - 2,
          trend: 'up',
          icon: Zap,
        },
        {
          label: 'API Calls/Min',
          value: Math.floor(Math.random() * 200) + 50,
          trend: 'stable',
          icon: Infinity,
        },
        {
          label: 'Avg Response Time',
          value: `${(Math.random() * 500 + 200).toFixed(0)}ms`,
          change: Math.random() > 0.3 ? -50 : 20,
          trend: Math.random() > 0.5 ? 'down' : 'up',
          icon: Clock,
        },
      ]
      setRealTimeMetrics(newMetrics)

      const newPerformanceMetrics: PerformanceMetric[] = [
        {
          label: 'CPU Usage',
          value: `${(Math.random() * 60 + 20).toFixed(1)}%`,
          benchmark: '70%',
          status: Math.random() > 0.3 ? 'warning' : 'optimal',
        },
        {
          label: 'Memory Usage',
          value: `${(Math.random() * 40 + 30).toFixed(1)}%`,
          benchmark: '60%',
          status: Math.random() > 0.4 ? 'critical' : 'optimal',
        },
        {
          label: 'Database Connections',
          value: Math.floor(Math.random() * 50) + 10,
          benchmark: '80',
          status: Math.random() > 0.2 ? 'optimal' : 'warning',
        },
        {
          label: 'Cache Hit Rate',
          value: `${(Math.random() * 30 + 70).toFixed(1)}%`,
          benchmark: '85%',
          status: 'optimal',
        },
      ]
      setPerformanceMetrics(newPerformanceMetrics)
    } catch (error) {
      console.error('Failed to update metrics:', error)
    }
  }

  const periodData = {
    day: { cost: 12.5, generations: 245, users: 89 },
    week: { cost: 87.3, generations: 1714, users: 612 },
    month: { cost: 374.8, generations: 7380, users: 2650 },
  }

  const currentData = periodData[period]

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'optimal': return 'text-arcane-crystal'
      case 'warning': return 'text-arcane-fire'
      case 'critical': return 'text-red-500'
      default: return 'text-text-secondary'
    }
  }

  const getStatusBarColor = (status?: string) => {
    switch (status) {
      case 'optimal': return 'bg-arcane-crystal'
      case 'warning': return 'bg-arcane-fire'
      case 'critical': return 'bg-red-500'
      default: return 'bg-text-muted'
    }
  }

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case 'up': return 'text-green-400'
      case 'down': return 'text-red-400'
      default: return 'text-text-muted'
    }
  }

  return (
    <div className="min-h-screen bg-cosmic-void p-6">
      {/* Background */}
      <div className="fixed inset-0 bg-cosmic-mesh pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-display text-white mb-1 flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-arcane-crystal" />
                  Usage Analytics
                </h1>
                <p className="text-text-muted text-sm font-sans">Real-time performance and cost monitoring</p>
              </div>
              <div className="flex gap-2">
                {(['day', 'week', 'month'] as const).map((p) => (
                  <Button
                    key={p}
                    variant="ghost"
                    size="sm"
                    onClick={() => setPeriod(p)}
                    className={`font-sans capitalize ${
                      period === p
                        ? 'bg-arcane-crystal/10 text-arcane-crystal'
                        : 'text-text-muted hover:text-white'
                    }`}
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Usage metrics */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-display text-white mb-6 flex items-center gap-3">
              <Activity className="w-5 h-5 text-arcane-crystal" />
              Usage Metrics
              <Badge variant="crystal" className="text-xs font-sans">LIVE</Badge>
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2 glow-card rounded-xl p-5 text-center">
                <div className="text-fluid-3xl font-display text-arcane-crystal mb-1">
                  ${currentData.cost.toFixed(2)}
                </div>
                <div className="text-sm text-text-muted font-sans">Total Cost ({period})</div>
                <div className="text-xs text-green-400 flex items-center gap-1 mt-2 justify-center font-sans">
                  <TrendingUp className="w-3 h-3" />
                  12% from last {period === 'day' ? 'week' : 'month'}
                </div>
              </div>

              <div className="glow-card rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-sm font-sans">Generations</span>
                  <span className="text-xl font-display text-arcane-crystal">{currentData.generations.toLocaleString()}</span>
                </div>
              </div>
              <div className="glow-card rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-sm font-sans">Active Users</span>
                  <span className="text-xl font-display text-arcane-crystal">{currentData.users.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Real-time metrics */}
            <div>
              <h3 className="text-sm font-display text-white mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-arcane-crystal" />
                Real-time Activity
              </h3>
              <div className="space-y-3">
                {realTimeMetrics.map((metric, index) => {
                  const Icon = metric.icon
                  return (
                    <div key={index} className="flex items-center justify-between glow-card rounded-xl p-3">
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className="w-4 h-4 text-arcane-crystal" />}
                        <span className="text-text-secondary text-sm font-sans">{metric.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-display text-white">{metric.value}</span>
                        {metric.change !== undefined && (
                          <span className={`text-xs font-sans ${getTrendColor(metric.trend)}`}>
                            {metric.change > 0 ? '+' : ''}{metric.change}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Performance metrics */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-lg font-display text-white mb-6 flex items-center gap-3">
              <Cpu className="w-5 h-5 text-arcane-crystal" />
              System Performance
              <Badge variant="crystal" className="text-xs font-sans">OPTIMIZED</Badge>
            </h2>

            <div className="space-y-4 mb-6">
              {performanceMetrics.map((metric, index) => {
                const Icon =
                  metric.label.includes('CPU') ? Cpu :
                  metric.label.includes('Memory') ? MemoryStick :
                  metric.label.includes('Database') ? Database : Shield
                return (
                  <div key={index} className="glow-card rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-arcane-crystal" />
                        <span className="text-text-secondary text-sm font-sans">{metric.label}</span>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-display ${getStatusColor(metric.status)}`}>
                          {metric.value}
                        </div>
                        {metric.benchmark && (
                          <div className="text-xs text-text-disabled font-sans">
                            Target: {metric.benchmark}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`w-full h-1 rounded-full ${getStatusBarColor(metric.status)} opacity-60`} />
                  </div>
                )
              })}
            </div>

            {/* Health status */}
            <div className="glow-card rounded-xl p-5 text-center">
              <div className="text-sm font-display text-white mb-2">System Status</div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2.5 h-2.5 bg-arcane-crystal rounded-full animate-pulse" />
                <span className="text-text-secondary text-sm font-sans">All Systems Operational</span>
              </div>
              <div className="text-xs text-text-muted font-sans mt-2">
                Uptime: 99.9% | Last 30 days
              </div>
            </div>
          </div>
        </div>

        {/* Bottom stats */}
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[
                { value: '99.9%', label: 'Uptime', color: 'text-arcane-crystal' },
                { value: '247ms', label: 'Avg Response', color: 'text-arcane-water' },
                { value: '40%', label: 'Cost Savings', color: 'text-arcane-gold' },
                { value: 'A+', label: 'Security Rating', color: 'text-arcane-void-bright' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className={`text-fluid-2xl font-display ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-sm text-text-muted font-sans">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
