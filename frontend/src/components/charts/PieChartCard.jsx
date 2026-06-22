import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  useMediaQuery,
} from '@mui/material'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatLargeNumber, formatCurrency } from '../../utils/formatUtils'

const PieChartCard = ({ 
  title, 
  data, 
  dataKey, 
  colors, 
  height, 
  isMobile,
  showLabels = true,
  totalData, // Pass total data for percentage calculation
  additionalFields = [], // Array of additional fields to show in tooltip: [{ key: 'average_salary', label: 'Avg Salary', formatter: formatCurrency }]
  nameKey = 'name' // Field to use for labels (default: 'name')
}) => {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      const total = totalData ? totalData.reduce((sum, item) => sum + item.count, 0) : data.count
      return (
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '12px',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography variant="body2" fontWeight={600} gutterBottom>
            {data[nameKey]}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Count: {formatLargeNumber(data.count)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Percentage: {((data.count / total) * 100).toFixed(1)}%
          </Typography>
          {additionalFields.map((field, index) => {
            const value = data[field.key]
            const formattedValue = field.formatter ? field.formatter(value) : value
            return (
              <Typography key={index} variant="body2" color="text.secondary">
                {field.label}: {formattedValue}
              </Typography>
            )
          })}
        </Box>
      )
    }
    return null
  }

  return (
    <Card sx={{ height: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)' }}>
      <CardContent sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Typography
          variant={isMobile ? 'body1' : 'h6'}
          gutterBottom
          fontWeight={600}
        >
          {title}
        </Typography>
        <Box sx={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={showLabels ? ({ name, percent }) => {
                  const displayName = name || data.find(d => d.name === name)?.[nameKey] || name
                  return isMobile
                    ? `${(percent * 100).toFixed(0)}%`
                    : `${displayName} (${(percent * 100).toFixed(0)}%)`
                } : undefined}
                outerRadius={isMobile ? 60 : 80}
                innerRadius={isMobile ? 30 : 40}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={nameKey}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: isMobile ? 10 : 12 }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default PieChartCard
