
import { useEffect, useState } from 'react'
import {
  Activity,
  CalendarDays,
  Play,
  Radiation,
  ShieldAlert,
  Orbit,
  LoaderCircle,
} from 'lucide-react'

import {
  getSimulationScenarios,
  runMissionSimulation,
} from '../services/healthApi'

function MissionSimulation() {
  const [scenarios, setScenarios] = useState([])
  const [selectedScenario, setSelectedScenario] = useState('normal')
  const [missionDay, setMissionDay] = useState(1)

  const [simulation, setSimulation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [scenariosLoading, setScenariosLoading] = useState(true)
  const [error, setError] = useState('')

  // Load available scenarios
  useEffect(() => {
    async function loadScenarios() {
      try {
        const result = await getSimulationScenarios()
        setScenarios(result.scenarios || [])
      } catch (err) {
        setError(err.message || 'Unable to load mission scenarios.')
      } finally {
        setScenariosLoading(false)
      }
    }

    loadScenarios()
  }, [])

  // Run selected simulation
  async function handleSimulation() {
    setLoading(true)
    setError('')
    setSimulation(null)

    try {
      const result = await runMissionSimulation(
        selectedScenario,
        Number(missionDay)
      )

      setSimulation(result.simulation)
    } catch (err) {
      setError(err.message || 'Unable to run simulation.')
    } finally {
      setLoading(false)
    }
  }

  const environment = simulation?.environment
  const health = simulation?.simulatedHealth

  return (
    <div className="simulation-page">
      <div className="page-heading">
        <div>
          <h2>Mission Simulation</h2>
          <p>
            Explore synthetic astronaut health observations under
            different simulated mission conditions.
          </p>
        </div>
        <Orbit size={28} />
      </div>

      {/* Simulation Controls */}
      <section className="panel simulation-controls">
        <div className="panel-heading">
          <div>
            <h3>Configure Mission Scenario</h3>
            <p>Select a scenario and mission day to begin.</p>
          </div>
          <Radiation size={21} />
        </div>

        {scenariosLoading ? (
          <p>Loading mission scenarios...</p>
        ) : (
          <>
            <div className="simulation-form">
              <div className="form-group">
                <label htmlFor="scenario">Mission Scenario</label>
                <select
                  id="scenario"
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                >
                  {scenarios.map((scenario) => (
                    <option key={scenario.id} value={scenario.id}>
                      {scenario.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="missionDay">Mission Day</label>
                <input
                  id="missionDay"
                  type="number"
                  min="1"
                  max="1000"
                  value={missionDay}
                  onChange={(e) => setMissionDay(e.target.value)}
                />
              </div>
            </div>

            <button
              className="primary-button"
              onClick={handleSimulation}
              disabled={loading || !missionDay || Number(missionDay) < 1 || Number(missionDay) > 1000 || !Number.isInteger(Number(missionDay))}
            >
              {loading ? (
                <>
                  <LoaderCircle size={17} />
                  Running Simulation...
                </>
              ) : (
                <>
                  <Play size={17} />
                  Run Mission Simulation
                </>
              )}
            </button>
          </>
        )}

        {error && (
          <div className="analysis-error">
            {error}
          </div>
        )}
      </section>

      {/* Simulation Results */}
      {simulation && (
        <>
          <section className="panel">
            <div className="panel-heading">
              <div>
                <h3>{simulation.scenarioName}</h3>
                <p>Mission Day {simulation.missionDay}</p>
              </div>
              <CalendarDays size={21} />
            </div>

            <p>{simulation.description}</p>

            <div className="simulation-grid">
              <div className="simulation-card">
                <Radiation size={21} />
                <span>Radiation Level</span>
                <strong>{environment.radiationLevel}</strong>
              </div>

              <div className="simulation-card">
                <Orbit size={21} />
                <span>Gravity Condition</span>
                <strong>{environment.gravityCondition}</strong>
              </div>

              <div className="simulation-card">
                <ShieldAlert size={21} />
                <span>Isolation Level</span>
                <strong>{environment.isolationLevel}</strong>
              </div>
            </div>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <h3>Simulated Health Observations</h3>
                <p>Synthetic demonstration values only</p>
              </div>
              <Activity size={21} />
            </div>

            <div className="simulation-grid">
              <div className="simulation-card">
                <span>Heart Rate</span>
                <strong>{health.heartRate} bpm</strong>
              </div>

              <div className="simulation-card">
                <span>Blood Pressure</span>
                <strong>
                  {health.systolicBP}/{health.diastolicBP} mmHg
                </strong>
              </div>

              <div className="simulation-card">
                <span>Body Temperature</span>
                <strong>{health.bodyTemperature} °C</strong>
              </div>

              <div className="simulation-card">
                <span>Sleep Duration</span>
                <strong>{health.sleepHours} hours</strong>
              </div>

              <div className="simulation-card">
                <span>Stress Level</span>
                <strong>{health.stressLevel}/10</strong>
              </div>
            </div>
          </section>

          <div className="simulation-disclaimer">
            <strong>Simulation Disclaimer</strong>
            <p>{simulation.disclaimer}</p>
          </div>

          <p className="simulation-timestamp">
            Generated: {new Date(simulation.generatedAt).toLocaleString()}
          </p>
        </>
      )}
    </div>
  )
}

export default MissionSimulation
