
import React from 'react'
import {
  UserRound,
  Satellite,
  CalendarDays,
  MapPin,
  Orbit,
  Users,
  Clock,
  ShieldCheck,
  Activity,
  Flag,
} from 'lucide-react'

const missionDetails = [
  {
    label: 'Mission Name',
    value: 'Artemis Demo Mission',
    icon: Satellite,
  },
  {
    label: 'Mission Destination',
    value: 'Lunar Orbit',
    icon: MapPin,
  },
  {
    label: 'Mission Duration',
    value: '180 Days',
    icon: Clock,
  },
  {
    label: 'Current Mission Day',
    value: 'Day 30',
    icon: CalendarDays,
  },
  {
    label: 'Gravity Environment',
    value: 'Microgravity',
    icon: Orbit,
  },
  {
    label: 'Mission Status',
    value: 'In Progress (Demo)',
    icon: Flag,
  },
]

function MissionProfile() {
  return (
    <div className="mission-profile-page">
      <div className="mission-profile-header">
        <div>
          <span className="mission-profile-eyebrow">
            <Satellite size={15} />
            MISSION MANAGEMENT
          </span>

          <h1>Mission Profile</h1>

          <p>
            Explore mission information, crew details and mission objectives.
          </p>
        </div>
      </div>

      <div className="mission-profile-notice">
        <ShieldCheck size={21} />
        <div>
          <strong>Demonstration Mission</strong>
          <p>
            All mission and crew information displayed here is synthetic
            demonstration data. It does not represent a real astronaut
            or an active NASA mission.
          </p>
        </div>
      </div>

      <div className="mission-overview-card">
        <div className="mission-overview-icon">
          <Satellite size={30} />
        </div>

        <div>
          <span>ACTIVE DEMONSTRATION MISSION</span>
          <h2>Artemis Demo Mission</h2>
          <p>Human Spaceflight Health Monitoring</p>
        </div>

        <div className="mission-day-badge">
          <strong>30</strong>
          <span>MISSION DAY</span>
        </div>
      </div>

      <div className="mission-profile-section">
        <div className="mission-profile-section-heading">
          <h2>Mission Information</h2>
          <p>Overview of the current demonstration mission.</p>
        </div>

        <div className="mission-details-grid">
          {missionDetails.map((item) => {
            const Icon = item.icon

            return (
              <div className="mission-detail-card" key={item.label}>
                <div className="mission-detail-icon">
                  <Icon size={21} />
                </div>

                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="mission-profile-bottom-grid">
        <div className="mission-information-card">
          <div className="mission-card-heading">
            <Users size={20} />
            <h3>Crew Information</h3>
          </div>

          <div className="crew-profile">
            <div className="crew-avatar">
              <UserRound size={25} />
            </div>

            <div>
              <strong>Demo Crew Member 01</strong>
              <span>Mission Commander (Demo)</span>
            </div>
          </div>

          <p className="mission-card-description">
            This demonstration crew profile represents a sample astronaut
            record used to illustrate ASTRA's mission monitoring features.
          </p>
        </div>

        <div className="mission-information-card">
          <div className="mission-card-heading">
            <Activity size={20} />
            <h3>Mission Objectives</h3>
          </div>

          <ul className="mission-objectives">
            <li>Monitor astronaut health observations.</li>
            <li>Track changes in personal health baselines.</li>
            <li>Review potential health concerns.</li>
            <li>Explore simulated mission conditions.</li>
          </ul>
        </div>
      </div>

      <div className="mission-timeline-card">
        <div className="mission-card-heading">
          <CalendarDays size={20} />
          <h3>Mission Timeline</h3>
        </div>

        <div className="mission-timeline">
          <div className="timeline-item completed">
            <span className="timeline-dot" />
            <div>
              <strong>Mission Preparation</strong>
              <p>Pre-mission planning and health preparation</p>
              <span>Completed (Demo)</span>
            </div>
          </div>

          <div className="timeline-item completed">
            <span className="timeline-dot" />
            <div>
              <strong>Mission Launch</strong>
              <p>Beginning of the demonstration mission</p>
              <span>Completed (Demo)</span>
            </div>
          </div>

          <div className="timeline-item active">
            <span className="timeline-dot" />
            <div>
              <strong>Health Monitoring</strong>
              <p>Ongoing health observations and mission simulation</p>
              <span>Current Phase (Demo)</span>
            </div>
          </div>

          <div className="timeline-item">
            <span className="timeline-dot" />
            <div>
              <strong>Mission Completion</strong>
              <p>End of the demonstration mission</p>
              <span>Upcoming (Demo)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MissionProfile
