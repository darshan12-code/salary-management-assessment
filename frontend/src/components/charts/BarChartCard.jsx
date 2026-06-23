import React from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
} from '@mui/material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { formatLargeNumber } from '../../utils/formatUtils'

const BarChartCard = ({ 
  title, 
  data, 
  dataKey, 
  xAxisKey, 
  color, 
  name, 
  height, 
  isMobile,
  tooltipFormatter,
  additionalFields = []
}) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
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
            {label}
          </Typography>
          {payload.map((entry, index) => {
            let formattedValue = entry.value
            if (tooltipFormatter) {
              formattedValue = tooltipFormatter(entry.value, entry.dataKey)
            }
            return (
              <Typography key={index} variant="body2" color="text.secondary">
                {entry.name}: {formattedValue}
              </Typography>
            )
          })}
          {additionalFields.map((field, index) => {
            const data = payload[0]?.payload
            if (!data) return null
            const value = data[field.key]
            const formattedValue = field.formatter ? field.formatter(value) : value
            return (
              <Typography key={`additional-${index}`} variant="body2" color="text.secondary">
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
    <Card sx={{ height: '100%', width: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)' }}>
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
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey={xAxisKey}
                tick={{ fontSize: isMobile ? 10 : 12, fill: '#64748B' }}
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? 'end' : 'middle'}
                height={isMobile ? 60 : 30}
                stroke="#64748B"
              />
              <YAxis 
                tick={{ fontSize: isMobile ? 10 : 12, fill: '#64748B' }}
                tickFormatter={formatLargeNumber}
                stroke="#64748B"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: isMobile ? 10 : 12 }}
                iconType="circle"
              />
              <Bar 
                dataKey={dataKey} 
                fill={color} 
                name={name} 
                radius={[4, 4, 0, 0]} 
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  )
}

export default BarChartCard