
import React from 'react'
import {
  Radiation,
  Users,
  Radio,
  Orbit,
  ShieldAlert,
  HeartPulse,
  ExternalLink,
  BookOpen,
} from 'lucide-react'

const researchTopics = [
  {
    id: 1,
    title: 'Space Radiation',
    icon: Radiation,
    category: 'Space Environment',
    description:
      'Space radiation includes high-energy particles from galactic cosmic rays and solar events. Exposure is an important health and spacecraft safety concern during long-duration missions.',
    healthImpact:
      'Potential concerns include cellular damage and increased long-term health risks.',
    nasaUrl: 'https://www.nasa.gov/hrp/hazard-space-radiation/',
    source: 'NASA - Space Radiation',
  },
  {
    id: 2,
    title: 'Isolation and Confinement',
    icon: Users,
    category: 'Behavioral Health',
    description:
      'Astronauts may spend extended periods in small, isolated habitats, away from family and familiar surroundings.',
    healthImpact:
      'Potential concerns include stress, sleep difficulties, changes in mood and challenges with teamwork.',
    nasaUrl: 'https://www.nasa.gov/hrp/hazards/',
    source: 'NASA - Human Spaceflight Hazards',
  },
  {
    id: 3,
    title: 'Distance from Earth',
    icon: Radio,
    category: 'Mission Operations',
    description:
      'As missions travel farther from Earth, communication delays and limited access to supplies and medical support become more challenging.',
    healthImpact:
      'Crew members need reliable onboard systems and preparation to handle unexpected situations.',
    nasaUrl: 'https://www.nasa.gov/hrp/hazards/',
    source: 'NASA - Human Spaceflight Hazards',
  },
  {
    id: 4,
    title: 'Altered Gravity',
    icon: Orbit,
    category: 'Physical Health',
    description:
      'Microgravity and changes in gravitational conditions affect how the human body adapts while living and working in space.',
    healthImpact:
      'Research areas include bone changes, muscle loss, cardiovascular adaptations and balance difficulties.',
    nasaUrl: 'https://www.nasa.gov/hrp/risks/',
    source: 'NASA - Human Spaceflight Risks',
  },
  {
    id: 5,
    title: 'Hostile and Closed Environments',
    icon: ShieldAlert,
    category: 'Environmental Health',
    description:
      'Spacecraft are enclosed habitats where temperature, pressure, lighting, noise, air quality and microbial conditions must be carefully managed.',
    healthImpact:
      'Environmental conditions may affect immune responses, comfort and overall crew health.',
    nasaUrl: 'https://www.nasa.gov/hrp/hazard-hostile-closed-environments/',
    source: 'NASA - Closed Environments',
  },
  {
    id: 6,
    title: 'Cardiovascular and Bone Health',
    icon: HeartPulse,
    category: 'Human Physiology',
    description:
      'Spaceflight can change blood circulation, heart function, bone strength and musculoskeletal fitness.',
    healthImpact:
      'NASA studies exercise, nutrition and other countermeasures to help protect astronaut health.',
    nasaUrl: 'https://www.nasa.gov/humans-in-space/hhc-spaceflight-risks/',
    source: 'NASA - Human Health Countermeasures',
  },
]

function NASAResearch() {
  return (
    <div className="nasa-research-page">
      <div className="research-header">
        <div>
          <span className="research-eyebrow">
            <BookOpen size={15} />
            KNOWLEDGE CENTER
          </span>

          <h1>NASA Research Library</h1>

          <p>
            Explore scientific research about the effects of spaceflight
            on astronaut health and human performance.
          </p>
        </div>
      </div>

      <div className="research-notice">
        <BookOpen size={20} />

        <div>
          <strong>Research and Education</strong>
          <p>
            This library summarizes publicly available NASA research.
            It provides educational information and does not diagnose
            medical conditions or replace mission medical guidance.
          </p>
        </div>
      </div>

      <div className="research-section-heading">
        <div>
          <h2>Spaceflight Health Research</h2>
          <p>
            Explore six important research topics related to astronaut health.
          </p>
        </div>

        <span>{researchTopics.length} Topics</span>
      </div>

      <div className="research-grid">
        {researchTopics.map((topic) => {
          const Icon = topic.icon

          return (
            <article className="research-card" key={topic.id}>
              <div className="research-card-top">
                <div className="research-icon">
                  <Icon size={23} />
                </div>

                <span className="research-category">
                  {topic.category}
                </span>
              </div>

              <h3>{topic.title}</h3>

              <p className="research-description">
                {topic.description}
              </p>

              <div className="research-impact">
                <strong>Health Research Focus</strong>
                <p>{topic.healthImpact}</p>
              </div>

              <a
                href={topic.nasaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="research-link"
              >
                {topic.source}
                <ExternalLink size={15} />
              </a>
            </article>
          )
        })}
      </div>

      <div className="research-footer">
        <p>
          Research source: NASA Human Research Program.
          ASTRA is an independent educational prototype and is not
          affiliated with or endorsed by NASA.
        </p>
      </div>
    </div>
  )
}

export default NASAResearch
