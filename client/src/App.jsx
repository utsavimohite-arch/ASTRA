import { checkBackend } from './services/healthApi'
import { useState } from 'react'
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
  { name: 'Mission Profile', icon: Satellite },
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

useState(() => {
  checkBackend()
    .then(() => setBackendStatus('Connected'))
    .catch(() => setBackendStatus('Disconnected'))
})


  const renderContent = () => {
  if (activePage === 'Health Records') {
    return <HealthRecords />
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
