import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { motion } from 'framer-motion'

const DEFAULT_COLORS = ['#2563eb', '#f97316', '#eab308', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899']

/**
 * Pie chart: total spend by category. 3D-style container.
 */
export default function PieChartSpend({ data = [], title = 'Spend by category' }) {
  const chartData = data.length > 0 ? data : []
  const colors = chartData.map((d, i) => d.fill || DEFAULT_COLORS[i % DEFAULT_COLORS.length])

  const renderTooltip = ({ payload }) => {
    if (!payload?.[0]) return null
    const d = payload[0]
    const total = chartData.reduce((s, x) => s + x.value, 0)
    const pct = total ? ((d.value / total) * 100).toFixed(1) : 0
    return (
      <div className="px-3 py-2 rounded-xl bg-card dark:bg-card-dark border border-gray-200 dark:border-gray-700 shadow-3d text-sm">
        <span className="font-medium text-gray-900 dark:text-white">{d.name}</span>
        <span className="block text-muted dark:text-muted-dark">
          ₹{d.value?.toLocaleString()} ({pct}%)
        </span>
      </div>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-card dark:bg-card-dark border border-gray-100 dark:border-gray-800/50 shadow-3d overflow-hidden"
    >
      <div className="px-4 pt-4 pb-1">
        <h3 className="font-display font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="h-[280px] w-full px-2 pb-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1.5}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={colors[i]} />
              ))}
            </Pie>
            <Tooltip content={renderTooltip} />
            <Legend
              layout="horizontal"
              align="center"
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: 8 }}
              formatter={(value) => <span className="text-xs text-muted dark:text-muted-dark">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  )
}
