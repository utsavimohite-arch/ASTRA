import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'

function HealthTrends({ records }) {
  // Sort records from oldest to newest
  const chartData = [...records]
    .sort(
      (a, b) =>
        new Date(a.recorded_at) - new Date(b.recorded_at)
    )
    .map((record) => ({
      date: new Date(
        record.recorded_at.replace(' ', 'T') + 'Z'
      ).toLocaleString(),

      heartRate: Number(record.heart_rate),
      systolicBP: Number(record.systolic_bp),
      diastolicBP: Number(record.diastolic_bp),
      temperature: Number(record.body_temperature),

      sleepHours:
        record.sleep_hours == null
          ? null
          : Number(record.sleep_hours),
    }))

  if (chartData.length === 0) {
    return (
      <section className="panel">
        <h2>Health Trends</h2>
        <p>
          Add health observations to see your historical health trends.
        </p>
      </section>
    )
  }

  return (
    <section className="panel health-trends-panel">
      <div className="panel-heading">
        <div>
          <h2>Health Trends</h2>
          <p>Visual overview of your saved health observations</p>
        </div>
      </div>

      <div className="health-chart">
        <h3>Heart Rate</h3>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="heartRate"
              name="Heart Rate (bpm)"
              stroke="#38bdf8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="health-chart">
        <h3>Blood Pressure</h3>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="systolicBP"
              name="Systolic (mmHg)"
              stroke="#f97316"
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="diastolicBP"
              name="Diastolic (mmHg)"
              stroke="#a78bfa"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="health-chart">
        <h3>Body Temperature</h3>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="temperature"
              name="Temperature (°C)"
              stroke="#facc15"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="health-chart">
        <h3>Sleep Duration</h3>

        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line
              type="monotone"
              dataKey="sleepHours"
              name="Sleep (hours)"
              stroke="#34d399"
              strokeWidth={2}
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <p className="record-safety-note">
        These charts show recorded observations over time.
        They are for demonstration and trend review only,
        not medical diagnosis.
      </p>
    </section>
  )
}

export default HealthTrends