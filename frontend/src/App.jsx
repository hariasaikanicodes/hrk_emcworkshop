import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import UploadSection from "./components/UploadSection"
import HowItWorks from "./components/HowItWorks"
import Footer from "./components/Footer"

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <UploadSection />
        <HowItWorks />
      </main>
      <Footer />
    </>
  )
}
