'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  ComposedChart,
  Scatter,
  ScatterChart,
  ReferenceLine,
  Brush,
  FunnelChart as RechartsFunnelChart,
  Funnel,
  LabelList
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  MoreHorizontal,
  Download,
  Share2,
  Maximize,
  Filter,
  Calendar,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
  Info,
  AlertCircle,
  CheckCircle,
  Zap,
  Target,
  Users,
  DollarSign,
  MousePointer,
  Globe,
  Clock,
  Activity
} from 'lucide-react'

// Chart color palettes
const COLORS = {
  primary: ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#EC4899'],
  gradient: [
    { start: '#8B5CF6', end: '#A78BFA' },
    { start: '#06B6D4', end: '#67E8F9' },
    { start: '#10B981', end: '#6EE7B7' },
    { start: '#F59E0B', end: '#FCD34D' },
    { start: '#EF4444', end: '#FCA5A5' },
    { start: '#EC4899', end: '#F9A8D4' }
  ],
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4'
  }
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, formatter, labelFormatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900 mb-2">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-gray-600">{entry.name}:</span>
            <span className="font-semibold text-gray-900">
              {formatter ? formatter(entry.value, entry.name) : entry.value}
            </span>
          </div>
        ))}
      </div>
    )
  }
  return null
}

// Chart container with controls
interface ChartContainerProps {
  title: string
  subtitle?: string
  children: React.ReactNode
  onExport?: () => void
  onShare?: () => void
  onFullscreen?: () => void
  showControls?: boolean
  isLoading?: boolean
  error?: string
  className?: string
}

export const ChartContainer = ({ 
  title, 
  subtitle, 
  children, 
  onExport, 
  onShare, 
  onFullscreen,
  showControls = true,
  isLoading = false,
  error,
  className = ""
}: ChartContainerProps) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {showControls && (
          <div className="flex items-center gap-2">
            <button 
              onClick={onExport}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Export Chart"
            >
              <Download className="w-4 h-4" />
            </button>
            <button 
              onClick={onShare}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Share Chart"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={onFullscreen}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-3 text-gray-500">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading chart data...</span>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  )
}

// Line Chart Component
interface LineChartProps {
  data: any[]
  xKey: string
  yKeys: string[]
  colors?: string[]
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  showBrush?: boolean
  formatter?: (value: any, name: string) => string
}

export const LineChart = ({ 
  data, 
  xKey, 
  yKeys, 
  colors = COLORS.primary,
  height = 300,
  showGrid = true,
  showLegend = true,
  showBrush = false,
  formatter
}: LineChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
        <XAxis dataKey={xKey} stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        {showLegend && <Legend />}
        {yKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            strokeWidth={2}
            dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: colors[index % colors.length], strokeWidth: 2 }}
          />
        ))}
        {showBrush && <Brush dataKey={xKey} height={30} stroke={colors[0]} />}
      </RechartsLineChart>
    </ResponsiveContainer>
  )
}

// Bar Chart Component
interface BarChartProps {
  data: any[]
  xKey: string
  yKeys: string[]
  colors?: string[]
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  stacked?: boolean
  formatter?: (value: any, name: string) => string
}

export const BarChart = ({ 
  data, 
  xKey, 
  yKeys, 
  colors = COLORS.primary,
  height = 300,
  showGrid = true,
  showLegend = true,
  stacked = false,
  formatter
}: BarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
        <XAxis dataKey={xKey} stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        {showLegend && <Legend />}
        {yKeys.map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={colors[index % colors.length]}
            stackId={stacked ? "stack" : undefined}
            radius={[2, 2, 0, 0]}
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

// Area Chart Component
interface AreaChartProps {
  data: any[]
  xKey: string
  yKeys: string[]
  colors?: string[]
  height?: number
  showGrid?: boolean
  showLegend?: boolean
  stacked?: boolean
  formatter?: (value: any, name: string) => string
}

export const AreaChart = ({ 
  data, 
  xKey, 
  yKeys, 
  colors = COLORS.primary,
  height = 300,
  showGrid = true,
  showLegend = true,
  stacked = false,
  formatter
}: AreaChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
        <XAxis dataKey={xKey} stroke="#6b7280" fontSize={12} />
        <YAxis stroke="#6b7280" fontSize={12} />
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        {showLegend && <Legend />}
        {yKeys.map((key, index) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stackId={stacked ? "stack" : undefined}
            stroke={colors[index % colors.length]}
            fill={colors[index % colors.length]}
            fillOpacity={0.6}
          />
        ))}
      </RechartsAreaChart>
    </ResponsiveContainer>
  )
}

// Pie Chart Component
interface PieChartProps {
  data: any[]
  dataKey: string
  nameKey: string
  colors?: string[]
  height?: number
  showLegend?: boolean
  showLabels?: boolean
  innerRadius?: number
  formatter?: (value: any, name: string) => string
}

export const PieChart = ({ 
  data, 
  dataKey, 
  nameKey,
  colors = COLORS.primary,
  height = 300,
  showLegend = true,
  showLabels = true,
  innerRadius = 0,
  formatter
}: PieChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsPieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          innerRadius={innerRadius}
          fill="#8884d8"
          dataKey={dataKey}
          nameKey={nameKey}
          label={showLabels}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip formatter={formatter} />} />
        {showLegend && <Legend />}
      </RechartsPieChart>
    </ResponsiveContainer>
  )
}

// Metric Card Component
interface MetricCardProps {
  title: string
  value: string | number
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  icon?: React.ReactNode
  color?: string
  subtitle?: string
  trend?: any[]
  className?: string
}

export const MetricCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  color = 'purple',
  subtitle,
  trend,
  className = ""
}: MetricCardProps) => {
  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'decrease': return <TrendingDown className="w-4 h-4 text-red-500" />
      default: return <Minus className="w-4 h-4 text-gray-500" />
    }
  }

  const getChangeColor = () => {
    switch (changeType) {
      case 'increase': return 'text-green-600'
      case 'decrease': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`p-2 bg-${color}-100 rounded-lg`}>
              {icon}
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 ${getChangeColor()}`}>
            {getTrendIcon()}
            <span className="text-sm font-medium">
              {change > 0 ? '+' : ''}{change}%
            </span>
          </div>
        )}
      </div>
      
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-gray-900">{value}</div>
          {trend && (
  <div className="w-20 h-8">
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={trend}>
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke={COLORS.primary[0]} 
          strokeWidth={2}
          dot={false}
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  </div>
)}
      </div>
    </div>
  )
}

// Progress Chart Component
interface ProgressChartProps {
  data: any[]
  height?: number
  colors?: string[]
}

export const ProgressChart = ({ 
  data, 
  height = 200,
  colors = COLORS.primary 
}: ProgressChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="90%" data={data}>
        <RadialBar
          label={{ position: 'insideStart', fill: '#fff' }}
          background
          clockWise
          dataKey="value"
          fill={colors[0]}
        />
        <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
      </RadialBarChart>
    </ResponsiveContainer>
  )
}

// Funnel Chart Component
interface FunnelChartProps {
  data: any[]
  height?: number
  colors?: string[]
}

export const FunnelChart = ({ 
  data, 
  height = 300,
  colors = COLORS.primary 
}: FunnelChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsFunnelChart>
        <Tooltip />
        <Funnel
          dataKey="value"
          data={data}
          isAnimationActive
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
          <LabelList position="center" fill="#fff" stroke="none" />
        </Funnel>
      </RechartsFunnelChart>
    </ResponsiveContainer>
  )
}

// Export all components
export {
  CustomTooltip,
  COLORS
}

