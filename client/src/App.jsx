import {
  checkBackend,
  getHealthBaseline,
  getLatestAssessment,
  getHealthAlerts,
   getAlertHistory,
} from './services/healthApi'
import { useEffect, useState } from 'react'
import MissionSimulation from './components/MissionSimulation'
import HealthRecords from './components/HealthRecords'
import {
  Activity,
  HeartPulse,
  Gauge,
  Thermometer,
  Droplets,
  Moon,
  Brain,
  Bell,
  Search,
  ChevronDown,
  Satellite,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  Clock3,
  CalendarDays,
  CircleHelp,
  Settings,
  LayoutDashboard,
  ClipboardList,
  ChartNoAxesCombined,
  UserRound,
  Menu,
  X,
  Zap,
  Footprints,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import './App.css'

const healthData = [
  { time: '06:00', heartRate: 68 },
  { time: '08:00', heartRate: 72 },
  { time: '10:00', heartRate: 70 },
  { time: '12:00', heartRate: 76 },
  { time: '14:00', heartRate: 73 },
  { time: '16:00', heartRate: 71 },
  { time: '18:00', heartRate: 74 },
]

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Health Records', icon: ClipboardList },
  { name: 'Health Analysis', icon: ChartNoAxesCombined },
  { name: 'Health Alerts', icon: Bell },
  { name: 'Mission Profile', icon: Satellite },
  { name: 'Mission Simulation', icon: Satellite },
]

function MetricCard({
  title,
  value,
  unit,
  icon: Icon,
  color,
  status,
  change,
  direction,
}) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <div className={`metric-icon ${color}`}>
          <Icon size={21} />
        </div>
        <span className="metric-status">
          <span className="status-dot"></span>
          {status}
        </span>
      </div>

      <p className="metric-title">{title}</p>

      <div className="metric-value">
        {value}
        <span>{unit}</span>
      </div>

      <div className="metric-bottom">
        {direction === 'up' ? (
          <ArrowUpRight size={15} />
        ) : (
          <ArrowDownRight size={15} />
        )}
        <span>{change}</span>
        <span className="metric-comparison">vs previous reading</span>
      </div>
    </div>
  )
}

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [backendStatus, setBackendStatus] = useState('Checking...')
  const [baselineData, setBaselineData] = useState(null)
const [assessmentData, setAssessmentData] = useState(null)
const [assessmentLoading, setAssessmentLoading] = useState(false)
const [assessmentError, setAssessmentError] = useState('')
const [alertsData, setAlertsData] = useState(null)
const [alertsLoading, setAlertsLoading] = useState(false)
const [alertsError, setAlertsError] = useState('')
const [alertHistory, setAlertHistory] = useState([])
const [historyLoading, setHistoryLoading] = useState(false)
const [historyError, setHistoryError] = useState('')
useEffect(() => {
  if (activePage !== 'Health Analysis') return

  let cancelled = false

  async function loadAssessment() {
    setAssessmentLoading(true)
    setAssessmentError('')

    try {
      const [baselineResult, assessmentResult] = await Promise.all([
        getHealthBaseline(),
        getLatestAssessment(),
      ])

      if (!cancelled) {
        setBaselineData(baselineResult.baseline)
        setAssessmentData(assessmentResult)
      }
    } catch (error) {
      if (!cancelled) {
        setAssessmentError(
          error.message || 'Unable to load health assessment.'
        )
      }
    } finally {
      if (!cancelled) {
        setAssessmentLoading(false)
      }
    }
  }

  loadAssessment()

  return () => {
    cancelled = true
  }
}, [activePage])

useEffect(() => {
  if (activePage !== 'Health Alerts') return

  let cancelled = false

  async function loadAlerts() {
    setAlertsLoading(true)
    setAlertsError('')

    try {
      const result = await getHealthAlerts()

      if (!cancelled) {
        setAlertsData(result)
      }
    } catch (error) {
      if (!cancelled) {
        setAlertsError(
          error.message || 'Unable to load health alerts.'
        )
      }
    } finally {
      if (!cancelled) {
        setAlertsLoading(false)
      }
    }
  }

  loadAlerts()

  return () => {
    cancelled = true
  }
}, [activePage])




// NEW: Load saved alert history
useEffect(() => {
  if (activePage !== 'Health Alerts') return

  let cancelled = false

  async function loadAlertHistory() {
    setHistoryLoading(true)
    setHistoryError('')

    try {
      const result = await getAlertHistory()

      if (!cancelled) {
        setAlertHistory(result.history || [])
      }
    } catch (error) {
      if (!cancelled) {
        setHistoryError(
          error.message || 'Unable to load alert history.'
        )
      }
    } finally {
      if (!cancelled) {
        setHistoryLoading(false)
      }
    }
  }

  loadAlertHistory()

  return () => {
    cancelled = true
  }
}, [activePage])

useEffect(() => {
  checkBackend()
    .then(() => setBackendStatus('Connected'))
    .catch(() => setBackendStatus('Disconnected'))
}, [])


  const renderContent = () => {
  if (activePage === 'Health Records') {
    return <HealthRecords />
  }

if (activePage === 'Health Analysis') {
  const metrics = assessmentData?.assessment?.metrics || []

  const baselineMetrics = [
    { label: 'Heart Rate', value: baselineData?.heartRate, unit: 'bpm' },
    { label: 'Systolic BP', value: baselineData?.systolicBP, unit: 'mmHg' },
    { label: 'Diastolic BP', value: baselineData?.diastolicBP, unit: 'mmHg' },
    { label: 'Body Temperature', value: baselineData?.bodyTemperature, unit: '°C' },
    { label: 'Sleep Duration', value: baselineData?.sleepHours, unit: 'hours' },
    { label: 'Stress Level', value: baselineData?.stressLevel, unit: '/10' },
    { label: 'Glucose', value: baselineData?.glucose, unit: 'mg/dL' },
  ]

  const statusLabel = (status) => {
    const labels = {
      notable_change: 'Notable change',
      close_to_reference: 'Close to reference',
      insufficient_data: 'Insufficient data',
    }

    return labels[status] || status
  }

  return (
    <div className="health-analysis-page">

      {assessmentLoading && (
        <div className="analysis-loading">
          Loading your health analysis...
        </div>
      )}

      {assessmentError && (
        <div className="analysis-error">
          {assessmentError}
        </div>
      )}

      {!assessmentLoading && !assessmentError && assessmentData && (
        <>
          <div className="analysis-summary">
            <h2>Personal Health Assessment</h2>

            <p>
              {assessmentData.message}
            </p>

            <div className="analysis-meta">
              <span>
                Records available: {baselineData?.sampleCount ?? 0}
              </span>

              <span>
                Baseline: {
                  baselineData?.isReliable
                    ? 'Available'
                    : 'Insufficient records'
                }
              </span>

              <span>
                Assessment: {
                  assessmentData.status === 'review_suggested'
                    ? 'Review suggested'
                    : assessmentData.status === 'no_notable_change'
                      ? 'No notable changes'
                      : assessmentData.status === 'no_records'
                        ? 'No records'
                        : 'Insufficient data'
                }
              </span>
            </div>
          </div>

          {assessmentData.status === 'no_records' ? (
            <div className="analysis-message">
              No health records are available yet. Add health observations
              in the Health Records section to begin your analysis.
            </div>
          ) : (
            <>
              <section className="panel">
                <div className="panel-heading">
                  <h3>Personal Health Baseline</h3>
                </div>

                <div className="baseline-grid">
                  {baselineMetrics.map((metric) => (
                    <div className="baseline-card" key={metric.label}>
                      <span>{metric.label}</span>

                      <strong>
                        {metric.value ?? '--'}
                      </strong>

                      <small>{metric.unit}</small>
                    </div>
                  ))}
                </div>

                {!baselineData?.isReliable && (
                  <div className="analysis-message">
                    {baselineData?.message}
                  </div>
                )}
              </section>

              <section className="panel">
                <div className="panel-heading">
                  <h3>Latest Measurement Comparison</h3>
                </div>

                {metrics.length > 0 ? (
                  <div className="assessment-list">
                    {metrics.map((metric) => (
                      <div className="assessment-item" key={metric.label}>
                        <div>
                          <strong>{metric.label}</strong>
                          <p>{metric.message}</p>
                          <span className="assessment-status">
                            {statusLabel(metric.status)}
                          </span>
                        </div>

                        <div className="assessment-values">
                          {metric.latestValue ?? '--'} {metric.unit || ''}
                          <br />
                          Baseline: {metric.baselineValue ?? '--'} {metric.unit || ''}
                          <br />
                          Difference: {metric.difference ?? '--'} {metric.unit || ''}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="analysis-message">
                    {assessmentData.message}
                    {' '}More health records are needed before measurements
                    can be compared.
                  </div>
                )}
              </section>

              <section className="analysis-observations">
                <h3>Additional Observations</h3>

                <p>
                  **Mood:** {assessmentData.latestRecord?.mood || 'Not recorded'}
                </p>

                <p>
                  **Symptoms:** {assessmentData.latestRecord?.symptoms || 'None recorded'}
                </p>

                <p>
                  **Latest record:** {assessmentData.latestRecord?.recorded_at || 'Unavailable'}
                </p>
              </section>
            </>
          )}

          <div className="analysis-message">
            <strong>Important disclaimer</strong>
            <br />
            This is an experimental software demonstration using illustrative
            comparison rules. It is not a medical diagnosis, clinically
            validated assessment, or substitute for professional medical
            advice. Review concerning observations with qualified medical
            personnel and follow applicable mission medical protocols.
          </div>
        </>
      )}
    </div>
  )
}

if (activePage === 'Health Alerts') {
  const alerts = alertsData?.alerts || []

  return (
    <div className="health-analysis-page">
      <div className="analysis-summary">
        <h2>Health Alerts & Guidance</h2>
        <p>
          Review observations that differ noticeably from your
          personal health baseline.
        </p>

        <div className="analysis-meta">
          <span>Alerts generated: {alertsData?.alertCount ?? 0}</span>
          <span>
            Status: {
              alertsData?.status === 'review_suggested'
                ? 'Review suggested'
                : alertsData?.status === 'no_notable_changes'
                  ? 'No notable changes'
                  : 'Awaiting assessment'
            }
          </span>
        </div>
      </div>

      {alertsLoading && (
        <div className="analysis-loading">
          Loading health alerts...
        </div>
      )}

      {alertsError && (
        <div className="analysis-error">
          {alertsError}
        </div>
      )}

      {!alertsLoading && !alertsError && alertsData && (
        <>
          {alerts.length === 0 ? (
            <div className="analysis-message">
              {alertsData.message}
            </div>
          ) : (
            <section className="panel">
              <div className="panel-heading">
                <h3>Observations requiring review</h3>
              </div>

              <div className="assessment-list">
                {alerts.map((alert, index) => (
                  <div className="assessment-item" key={`${alert.metric}-${index}`}>
                    <div>
                      <strong>
                        <AlertTriangle
                          size={16}
                          style={{ display: 'inline', marginRight: '8px' }}
                        />
                        {alert.metric}
                      </strong>

                      <p>{alert.message}</p>

                      <span className="assessment-status">
                        {alert.category}
                      </span>

                      <div className="analysis-observations">
                        <strong>Recommended actions</strong>

                        <ul>
                          {alert.recommendedActions.map((action, actionIndex) => (
                            <li key={actionIndex}>{action}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="assessment-values">
                      Latest: {alert.latestValue} {alert.unit}
                      <br />
                      Baseline: {alert.baselineValue} {alert.unit}
                      <br />
                      Difference: {alert.difference} {alert.unit}
                      <br />
                      <small>{alert.recordedAt}</small>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          
          <div className="analysis-message">
            <strong>Important disclaimer</strong>
            <br />
            These alerts use illustrative software comparison rules.
            They are not clinically validated severity classifications,
            medical diagnoses, or emergency detection. Follow approved
            mission medical protocols and consult qualified medical personnel.
          </div>
        </>
      )}

      {/* Saved Alert History */}
      {historyLoading && (
        <div className="analysis-loading">
          Loading alert history...
        </div>
      )}

      {historyError && (
        <div className="analysis-error">
          {historyError}
        </div>
      )}

      {!historyLoading && !historyError && (
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h3>Alert History</h3>
              <p>Previously generated and saved observations</p>
            </div>
            <Clock3 size={19} />
          </div>

          {alertHistory.length === 0 ? (
            <div className="analysis-message">
              No saved alert history is available yet.
            </div>
          ) : (
            <div className="assessment-list">
              {alertHistory.map((alert) => (
                <div className="assessment-item" key={alert.id}>
                  <div>
                    <strong>{alert.metric}</strong>
                    <p>{alert.message}</p>

                    <span className="assessment-status">
                      {alert.category}
                    </span>

                    <div className="analysis-observations">
                      <strong>Recommended actions</strong>
                      <ul>
                        {(alert.recommended_actions || []).map(
                          (action, index) => (
                            <li key={index}>{action}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  <div className="assessment-values">
                    Latest: {alert.latest_value} {alert.unit}
                    <br />
                    Baseline: {alert.baseline_value} {alert.unit}
                    <br />
                    Difference: {alert.difference} {alert.unit}
                    <br />
                    <small>Recorded: {alert.recorded_at}</small>
                    <br />
                    <small>Saved: {alert.created_at}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

    </div>
  )
}

if (activePage === 'Mission Simulation') {
  return <MissionSimulation />
}
  if (activePage !== 'Dashboard') {
      const selected = navItems.find((item) => item.name === activePage)

      return (
        <div className="coming-soon">
          <div className="coming-icon">
            {selected && <selected.icon size={36} />}
          </div>
          <h2>{activePage}</h2>
          <p>
            This module is part of the ASTRA development roadmap.
            We will implement it in an upcoming milestone.
          </p>
          <button
            className="primary-button"
            onClick={() => setActivePage('Dashboard')}
          >
            Return to Dashboard
          </button>
        </div>
      )
    }

    return (
      <>
        <section className="welcome-section">
          <div>
            <div className="eyebrow">
              <span className="live-dot"></span>
              MISSION CONTROL / HEALTH OVERVIEW
            </div>
            <h1>Welcome back, Commander.</h1>
            <p>
              Here's your health overview. Stay informed, stay mission-ready.
            </p>
          </div>

          <div className="mission-date">
            <CalendarDays size={17} />
            <span>MISSION DAY 047</span>
          </div>
        </section>

        <section className="health-summary">
          <div className="summary-main">
            <div className="summary-icon">
              <ShieldCheck size={25} />
            </div>
            <div>
              <span className="summary-label">MISSION HEALTH STATUS</span>
              <h2>Monitoring in progress</h2>
              <p>
                No illustrative demo alerts are currently active.
                Continue your scheduled health check-ins.
              </p>
            </div>
          </div>

          <div className="summary-side">
            <span className="summary-number">05</span>
            <span>INDICATORS TRACKED</span>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <h2>Vital signs</h2>
              <p>Your latest recorded health indicators</p>
            </div>
            <button className="text-button">
              View all records <ArrowUpRight size={15} />
            </button>
          </div>

          <div className="metrics-grid">
            <MetricCard
              title="Heart Rate"
              value="72"
              unit="bpm"
              icon={HeartPulse}
              color="pink"
              status="Demo reading"
              change="4 bpm"
              direction="down"
            />

            <MetricCard
              title="Blood Pressure"
              value="118/78"
              unit="mmHg"
              icon={Gauge}
              color="blue"
              status="Demo reading"
              change="2 mmHg"
              direction="up"
            />

            <MetricCard
              title="Body Temperature"
              value="36.8"
              unit="°C"
              icon={Thermometer}
              color="orange"
              status="Demo reading"
              change="0.2 °C"
              direction="up"
            />

            <MetricCard
              title="Blood Glucose"
              value="95"
              unit="mg/dL"
              icon={Droplets}
              color="purple"
              status="Demo reading"
              change="3 mg/dL"
              direction="down"
            />
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="panel chart-panel">
            <div className="panel-heading">
              <div>
                <h2>Heart rate trends</h2>
                <p>Illustrative readings throughout the day</p>
              </div>
              <span className="chart-period">TODAY</span>
            </div>

            <div className="chart-legend">
              <span className="legend-dot"></span>
              Heart rate <strong>72 bpm</strong>
            </div>

            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={healthData}
                  margin={{ top: 15, right: 8, left: -22, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="heartGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#39b9ff" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#39b9ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#263247"
                    strokeDasharray="4 5"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="time"
                    stroke="#718096"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#718096', fontSize: 11 }}
                  />

                  <YAxis
                    domain={[50, 100]}
                    stroke="#718096"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#718096', fontSize: 11 }}
                  />

                  <Tooltip
                    contentStyle={{
                      background: '#111d30',
                      border: '1px solid #293b55',
                      borderRadius: '10px',
                      color: '#ffffff',
                    }}
                    labelStyle={{ color: '#a8b7ca' }}
                  />

                  <Area
                    type="monotone"
                    dataKey="heartRate"
                    stroke="#39b9ff"
                    strokeWidth={2.5}
                    fill="url(#heartGradient)"
                    activeDot={{ r: 5, fill: '#39b9ff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-footer">
              <span><Clock3 size={14} /> Last updated: 18:00 UTC</span>
              <span>SIMULATED DATA</span>
            </div>
          </div>

          <div className="panel wellness-panel">
            <div className="panel-heading">
              <div>
                <h2>Daily wellness</h2>
                <p>Physical and mental well-being</p>
              </div>
              <Sparkles size={20} className="sparkle-icon" />
            </div>

            <div className="wellness-item">
              <div className="wellness-icon sleep-icon">
                <Moon size={20} />
              </div>
              <div className="wellness-info">
                <span>Sleep duration</span>
                <strong>7.5 <small>hours</small></strong>
                <div className="progress-track">
                  <div className="progress-fill sleep-fill"></div>
                </div>
              </div>
            </div>

            <div className="wellness-item">
              <div className="wellness-icon mood-icon">
                <Brain size={20} />
              </div>
              <div className="wellness-info">
                <span>Mood check-in</span>
                <strong>Good</strong>
                <p className="wellness-note">Illustrative self-report</p>
              </div>
            </div>

            <div className="wellness-item">
              <div className="wellness-icon stress-icon">
                <Zap size={20} />
              </div>
              <div className="wellness-info">
                <span>Stress level</span>
                <strong>Low</strong>
                <p className="wellness-note">Illustrative self-report</p>
              </div>
            </div>

            <button className="wellness-button">
              Complete daily check-in <ArrowUpRight size={15} />
            </button>
          </div>
        </section>

        <section className="panel alerts-panel">
          <div className="panel-heading">
            <div>
              <h2>Health observations</h2>
              <p>Important monitoring information</p>
            </div>
            <Bell size={19} className="alert-bell" />
          </div>

          <div className="alert-item">
            <div className="alert-symbol">
              <CheckCircle2 size={19} />
            </div>
            <div className="alert-content">
              <strong>No active demo alerts</strong>
              <p>
                Your sample dashboard has no flagged observations.
                Real health assessments will be implemented in a later milestone.
              </p>
            </div>
            <span className="alert-time">TODAY</span>
          </div>
        </section>

        <section className="safety-notice">
          <AlertTriangle size={17} />
          <p>
            <strong>Prototype notice:</strong> All displayed readings are
            simulated demonstration data, not actual astronaut measurements.
            ASTRA is not a medical diagnostic tool. Follow approved mission
            medical procedures for real health concerns.
          </p>
        </section>
      </>
    )
  }

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-symbol">
            <Satellite size={25} />
          </div>
          <div>
            <h2>ASTRA<span>.</span></h2>
            <p>MISSION HEALTH SYSTEM</p>
          </div>
          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mission-card">
          <span className="mission-card-label">ACTIVE MISSION</span>
          <div className="mission-name">
            <Satellite size={17} />
            <strong>DEEP SPACE 01</strong>
          </div>
          <span className="mission-subtitle">Deep Space Exploration</span>
          <div className="mission-progress">
            <div className="mission-progress-fill"></div>
          </div>
          <div className="mission-progress-label">
            <span>MISSION PROGRESS</span>
            <strong>47 DAYS</strong>
          </div>
        </div>

        <div className="nav-label">MAIN MENU</div>

        <nav className="navigation">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  activePage === item.name ? 'nav-active' : ''
                }`}
                onClick={() => {
                  setActivePage(item.name)
                  setSidebarOpen(false)
                }}
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {activePage === item.name && (
                  <span className="nav-indicator"></span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="nav-label settings-label">PREFERENCES</div>

        <button
          className={`nav-item ${
            activePage === 'Settings' ? 'nav-active' : ''
          }`}
          onClick={() => {
            setActivePage('Settings')
            setSidebarOpen(false)
          }}
        >
          <Settings size={19} />
          <span>Settings</span>
        </button>

        <div className="sidebar-bottom">
          <div className="support-card">
            <div className="support-icon">
              <CircleHelp size={19} />
            </div>
            <strong>Need assistance?</strong>
            <p>Access mission health guidance and support.</p>
            <button onClick={() => setActivePage('Health Analysis')}>
              Explore guidance <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="astronaut-profile">
            <div className="avatar">CM</div>
            <div className="profile-info">
              <strong>Commander Morgan</strong>
              <span>MISSION SPECIALIST</span>
            </div>
            <ChevronDown size={16} />
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="mobile-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <div className="breadcrumb">
              <span>ASTRA</span>
              <span>/</span>
              <strong>{activePage}</strong>
            </div>
          </div>

          <div className="topbar-right">
            <div className="connection-status">
              <span className="live-dot"></span>
              SYSTEM ONLINE
            </div>
            <button className="icon-button" aria-label="Search">
              <Search size={19} />
            </button>
            <button className="icon-button notification-button" aria-label="Notifications">
              <Bell size={19} />
              <span></span>
            </button>
            <div className="topbar-avatar">CM</div>
          </div>
        </header>

        <div className="page-content">
          {renderContent()}

          <footer className="footer">
            <span>ASTRA HEALTH MONITORING SYSTEM</span>
            <span>BUILT FOR HUMAN SPACE EXPLORATION <Footprints size={13} /></span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
