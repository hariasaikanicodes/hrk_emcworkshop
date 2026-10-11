import "./SkillsLists.css"

export default function SkillsLists({ present, missing }) {
  return (
    <div className="skills-grid">
      <div className="skills-card">
        <h3>✅ Skills present</h3>
        {present.length ? (
          <ul>
            {present.map((skill) => (
              <li key={skill} className="ok">
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">No skills detected</p>
        )}
      </div>

      <div className="skills-card">
        <h3>❌ Skills missing</h3>
        {missing.length ? (
          <ul>
            {missing.map((skill) => (
              <li key={skill} className="miss">
                {skill}
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty">Nothing missing — nice!</p>
        )}
      </div>
    </div>
  )
}
