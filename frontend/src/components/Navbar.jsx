import "./Navbar.css"

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">
        0<span>→</span>Shipped
      </div>
      <nav>
        <a href="#how">How it works</a>
        <a href="#upload">Try it</a>
      </nav>
    </header>
  )
}
