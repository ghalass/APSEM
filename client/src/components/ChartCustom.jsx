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
  //
  LineChart,
  Line,
} from 'recharts'

const ChartCustom = ({ data, xDataKey, barDataKeys = [], type = 'bar' }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      {type === 'bar' ? (
        <BarChart data={data} margin={{ bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xDataKey}
            angle={-45}
            textAnchor="end"
            tickFormatter={(tick) => (tick.length > 15 ? tick.slice(0, 15) + '...' : tick)}
          />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" />
          {barDataKeys.map((barDataKey, index) => (
            <Bar key={index} dataKey={barDataKey} fill={index % 2 === 0 ? '#8884d8' : '#82ca9d'}>
              <LabelList
                dataKey={barDataKey}
                position="top"
                fill="black"
                fontSize={12}
                fontWeight="bold"
              />
            </Bar>
          ))}
        </BarChart>
      ) : (
        <LineChart data={data} margin={{ bottom: 60, right: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xDataKey}
            angle={-45}
            textAnchor="end"
            tickFormatter={(tick) => (tick.length > 15 ? tick.slice(0, 15) + '...' : tick)}
          />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" />
          {barDataKeys.map((barDataKey, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={barDataKey}
              stroke={index % 2 === 0 ? '#8884d8' : '#82ca9d'}
            >
              <LabelList
                dataKey={barDataKey}
                position="top"
                fill="black"
                fontSize={12}
                fontWeight="bold"
              />
            </Line>
          ))}
        </LineChart>
      )}
    </ResponsiveContainer>
  )
}

export default ChartCustom
