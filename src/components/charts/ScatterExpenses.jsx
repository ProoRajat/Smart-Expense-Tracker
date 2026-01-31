import { ComposedChart, Line, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

/**
 * Scatter plot with dotted lines connecting the dots. Expense amount vs order.
 */
export default function ScatterExpenses({ data = [], title = 'Expense comparison' }) {
  const chartData = data.length > 0 ? [...data].sort((a, b) => a.x - b.x) : []

  const renderTooltip = ({ payload }) => {
    if (!payload?.[0]) return null
    const d = payload[0].payload
    return (
      <div className="px-3 py-2 rounded-xl bg-white dark:bg-card-dark border border-blue-200 dark:border-blue-800 shadow-3d text-sm">
        <span className="font-medium text-gray-900 dark:text-white">{d.name}</span>
        <span className="block text-muted dark:text-muted-dark">
          {d.category} · ₹{d.y?.toLocaleString()}
        </span>
      </div>
    )
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-2xl bg-card dark:bg-card-dark border border-blue-100 dark:border-blue-900/30 shadow-3d overflow-hidden"
    >
      <div className="px-4 pt-4 pb-1">
        <h3 className="font-display font-semibold text-gray-900 dark:text-white">{title}</h3>
        <p className="text-xs text-muted dark:text-muted-dark mt-0.5">
          Higher points = larger expense · Dotted line connects the dots
        </p>
      </div>
      <div className="h-[260px] w-full px-2 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(37,99,235,0.1)" />
            <XAxis
              type="number"
              dataKey="x"
              tick={{ fontSize: 10 }}
              tickFormatter={() => ''}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="number"
              dataKey="y"
              tick={{ fontSize: 10 }}
              tickFormatter={(v) => `₹${v >= 1000 ? v / 1000 + 'k' : v}`}
              axisLine={false}
              tickLine={false}
              className="text-muted dark:text-muted-dark"
            />
            <Tooltip content={renderTooltip} cursor={{ strokeDasharray: '3 3', stroke: '#2563eb' }} />
            <Line
              type="monotone"
              dataKey="y"
              stroke="#2563eb"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              connectNulls
            />
            <Scatter dataKey="y" fill="#2563eb" fillOpacity={0.9} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  )
}
