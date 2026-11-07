
import { useEffect, useState } from 'react'
import {
  getHealthRecords,
  saveHealthRecord,
} from '../services/healthApi'

function HealthRecords() {
  const initialForm = {
    heart_rate: '',
    systolic_bp: '',
    diastolic_bp: '',
    body_temperature: '',
    glucose: '',
    sleep_hours: '',
    mood: '',
    stress_level: '',
    symptoms: '',
  }

  const [form, setForm] = useState(initialForm)
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function loadRecords() {
    try {
      setLoading(true)
      setError('')

      const data = await getHealthRecords()
      setRecords(data.records || [])
    } catch (err) {
      setError(err.message || 'Unable to load health records.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRecords()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setSaving(true)
    setError('')
    setSuccess('')

    const record = {
      heart_rate: Number(form.heart_rate),
      systolic_bp: Number(form.systolic_bp),
      diastolic_bp: Number(form.diastolic_bp),
      body_temperature: Number(form.body_temperature),
      glucose: form.glucose === '' ? null : Number(form.glucose),
      sleep_hours: form.sleep_hours === '' ? null : Number(form.sleep_hours),
      mood: form.mood || null,
      stress_level:
        form.stress_level === '' ? null : Number(form.stress_level),
      symptoms: form.symptoms.trim() || null,
    }

    try {
      await saveHealthRecord(record)

      setSuccess('Health record saved successfully!')
      setForm(initialForm)

      await loadRecords()
    } catch (err) {
      setError(err.message || 'Unable to save health record.')
    } finally {
      setSaving(false)
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) return 'Date unavailable'

    const date = new Date(dateValue.replace(' ', 'T') + 'Z')

    if (Number.isNaN(date.getTime())) {
      return dateValue
    }

    return date.toLocaleString()
  }

  return (
    <div className="health-records-page">
      <section className="welcome-section">
        <div>
          <div className="eyebrow">
            HEALTH MONITORING / RECORD MANAGEMENT
          </div>
          <h1>Health Records</h1>
          <p>
            Record health observations and review previously saved entries.
          </p>
        </div>
      </section>

      <section className="panel health-form-panel">
        <div className="panel-heading">
          <div>
            <h2>New health observation</h2>
            <p>Enter a health reading or self-reported observation.</p>
          </div>
        </div>

        <form
  onSubmit={handleSubmit}
  onKeyDown={(event) => {
    if (event.key === 'Enter' && event.target.tagName !== 'TEXTAREA') {
      event.preventDefault()
    }
  }}
  className="health-record-form"
>
          <div className="form-grid">
            <label>
              Heart rate (bpm) *
              <input
                type="number"
                name="heart_rate"
                min="0"
                step="any"
                value={form.heart_rate}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Systolic blood pressure (mmHg) *
              <input
                type="number"
                name="systolic_bp"
                min="0"
                step="any"
                value={form.systolic_bp}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Diastolic blood pressure (mmHg) *
              <input
                type="number"
                name="diastolic_bp"
                min="0"
                step="any"
                value={form.diastolic_bp}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Body temperature (°C) *
              <input
                type="number"
                name="body_temperature"
                min="0"
                step="any"
                value={form.body_temperature}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Blood glucose (mg/dL)
              <input
                type="number"
                name="glucose"
                min="0"
                step="any"
                value={form.glucose}
                onChange={handleChange}
              />
            </label>

            <label>
              Sleep duration (hours)
              <input
                type="number"
                name="sleep_hours"
                min="0"
                step="any"
                value={form.sleep_hours}
                onChange={handleChange}
              />
            </label>

            <label>
              Mood
              <select
                name="mood"
                value={form.mood}
                onChange={handleChange}
              >
                <option value="">Select mood</option>
                <option value="Good">Good</option>
                <option value="Okay">Okay</option>
                <option value="Low">Low</option>
                <option value="Anxious">Anxious</option>
              </select>
            </label>

            <label>
              Stress level (1–10)
              <input
                type="number"
                name="stress_level"
                min="1"
                max="10"
                step="1"
                value={form.stress_level}
                onChange={handleChange}
              />
            </label>
          </div>

          <label className="symptoms-field">
            Symptoms or additional observations
            <textarea
              name="symptoms"
              rows="3"
              value={form.symptoms}
              onChange={handleChange}
              placeholder="Describe any symptoms or observations..."
            />
          </label>

          {error && <p className="form-error">{error}</p>}
          {success && <p className="form-success">{success}</p>}

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Health Record'}
          </button>
        </form>
      </section>

      <section className="panel records-history-panel">
        <div className="panel-heading">
          <div>
            <h2>Recorded observations</h2>
            <p>Previously saved health records</p>
          </div>
          <strong>{records.length} records</strong>
        </div>

        {loading ? (
          <p>Loading health records...</p>
        ) : records.length === 0 ? (
          <p>No health records have been saved yet.</p>
        ) : (
          <div className="records-list">
            {records.map((record) => (
              <article className="record-item" key={record.id}>
                <div className="record-item-heading">
                  <strong>Health Record #{record.id}</strong>
                  <span>{formatDate(record.recorded_at)}</span>
                </div>

                <div className="record-values">
                  <span>Heart rate: {record.heart_rate} bpm</span>
                  <span>
                    Blood pressure: {record.systolic_bp}/
                    {record.diastolic_bp} mmHg
                  </span>
                  <span>
                    Temperature: {record.body_temperature} °C
                  </span>

                  {record.glucose != null && (
                    <span>Glucose: {record.glucose} mg/dL</span>
                  )}

                  {record.sleep_hours != null && (
                    <span>Sleep: {record.sleep_hours} hours</span>
                  )}

                  {record.mood && <span>Mood: {record.mood}</span>}

                  {record.stress_level != null && (
                    <span>Stress: {record.stress_level}/10</span>
                  )}
                </div>

                {record.symptoms && (
                  <p className="record-symptoms">
                    Observations: {record.symptoms}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="record-safety-note">
        Prototype notice: This page stores observations for demonstration
        purposes. It does not diagnose medical conditions. Follow approved
        mission medical procedures for real health concerns.
      </p>
    </div>
  )
}

export default HealthRecords
