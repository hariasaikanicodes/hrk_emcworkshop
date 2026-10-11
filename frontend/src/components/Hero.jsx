import "./Hero.css"

export default function Hero() {
  return (
    <section className="hero">
      <h1>Resume Parser</h1>
      <p>
        Upload a PDF resume and instantly see your score, the skills you have,
        and the ones you're missing.
      </p>
      <a href="#upload" className="cta-btn">
        Get my score
      </a>
    </section>
  )
}
