import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Legend,
  LineChart,
  Line,
} from 'recharts'
import { useColorModes } from '@coreui/react'

const ChartCustom = ({ data, xDataKey, barDataKeys = [], type = 'bar' }) => {
  let colorMode = 'light'

  try {
    // Essayer d'utiliser useColorModes à chaque rendu
    const { colorMode: themeColorMode } = useColorModes('coreui-free-react-admin-template-theme')
    colorMode = themeColorMode
  } catch (error) {
    // Fallback: détection manuelle à chaque rendu
    const coreuiTheme = document.documentElement.getAttribute('data-coreui-theme')
    const hasDarkClass = document.documentElement.classList.contains('dark')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (coreuiTheme === 'dark' || hasDarkClass || prefersDark) {
      colorMode = 'dark'
    } else {
      colorMode = 'light'
    }
  }

  // Cette vérification se fait à chaque rendu
  const isDark = colorMode === 'dark'

  const chartConfig = {
    textColor: isDark ? '#ffffff' : '#000000',
    gridColor: isDark ? '#444444' : '#e0e0e0',
    tooltipBackground: isDark ? '#2d3748' : '#ffffff',
    labelColor: isDark ? '#ffffff' : '#000000',
    colors: [
      '#8884d8',
      '#82ca9d',
      '#ffc658',
      '#ff7300',
      '#8dd1e1',
      '#d084d0',
      '#ff8042',
      '#00C49F',
      '#FFBB28',
      '#FF8042',
    ],
  }

  return (
    <>
      {/* {JSON.stringify({ colorMode, isDark })} */}
      <ResponsiveContainer width="100%" height={300}>
        {type === 'bar' ? (
          <BarChart data={data} margin={{ bottom: 60, right: 20, left: 20, top: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
            <XAxis
              dataKey={xDataKey}
              angle={-45}
              textAnchor="end"
              tick={{ fill: chartConfig.textColor, fontSize: 12 }}
              tickFormatter={(tick) => (tick?.length > 15 ? tick.slice(0, 15) + '...' : tick)}
              height={80}
            />
            <YAxis tick={{ fill: chartConfig.textColor, fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: chartConfig.tooltipBackground,
                borderColor: chartConfig.gridColor,
                color: chartConfig.textColor,
              }}
            />
            <Legend wrapperStyle={{ color: chartConfig.textColor }} />
            {barDataKeys.map((barDataKey, index) => (
              <Bar
                key={index}
                dataKey={barDataKey}
                fill={chartConfig.colors[index % chartConfig.colors.length]}
                radius={[4, 4, 0, 0]}
              >
                <LabelList
                  dataKey={barDataKey}
                  position="top"
                  fill={chartConfig.labelColor}
                  fontSize={12}
                  fontWeight="bold"
                  stroke="none"
                />
              </Bar>
            ))}
          </BarChart>
        ) : (
          <LineChart data={data} margin={{ bottom: 60, right: 20, left: 20, top: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartConfig.gridColor} />
            <XAxis
              dataKey={xDataKey}
              angle={-45}
              textAnchor="end"
              tick={{ fill: chartConfig.textColor, fontSize: 12 }}
              tickFormatter={(tick) => (tick?.length > 15 ? tick.slice(0, 15) + '...' : tick)}
              height={80}
            />
            <YAxis tick={{ fill: chartConfig.textColor, fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: chartConfig.tooltipBackground,
                borderColor: chartConfig.gridColor,
                color: chartConfig.textColor,
              }}
            />
            <Legend wrapperStyle={{ color: chartConfig.textColor }} />
            {barDataKeys.map((barDataKey, index) => (
              <Line
                key={index}
                type="monotone"
                dataKey={barDataKey}
                stroke={chartConfig.colors[index % chartConfig.colors.length]}
                strokeWidth={2}
                dot={{
                  fill: chartConfig.colors[index % chartConfig.colors.length],
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              >
                <LabelList
                  dataKey={barDataKey}
                  position="top"
                  fill={chartConfig.labelColor}
                  fontSize={12}
                  fontWeight="bold"
                  stroke="none"
                />
              </Line>
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </>
  )
}

export default ChartCustom
