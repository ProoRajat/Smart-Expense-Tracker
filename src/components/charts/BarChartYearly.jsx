import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

/**
 * Bar chart: whole year monthly spend comparison. 3D-style container.
 */
export default function BarChartYearly({ data = [], title = 'Monthly spend this year' }) {
  const chartData = data.length > 0 ? data : []

  const renderTooltip = ({ payload }) => {
    if (!payload?.[0]) return null
    const d = payload[0].payload
    return (
      <div className="px-3 py-2 rounded-xl bg-card dark:bg-card-dark border border-gray-200 dark:border-gray-700 shadow-3d text-sm">
        <span className="font-medium text-gray-900 dark:text-white">{d.month}</span>
        <span className="block text-muted dark:text-muted-dark">
          ₹{d.spent?.toLocaleString()}
        </span>
      </div>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="rounded-2xl bg-card dark:bg-card-dark border border-gray-100 dark:border-gray-800/50 shadow-3d overflow-hidden"
    >
      <div className="px-4 pt-4 pb-1">
        <h3 className="font-display font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="h-[260px] w-full px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'currentColor' }}
              axisLine={false}
              tickLine={false}
              className="text-muted dark:text-muted-dark"
            />
            <YAxis
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `₹${v / 1000}k` : `₹${v}`)}
              className="text-muted dark:text-muted-dark"
            />
            <Tooltip content={renderTooltip} cursor={{ fill: 'rgba(37,99,235,0.08)' }} />
            <Bar dataKey="spent" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  )
}
