import { Hero } from '../components/sections/Hero'
import { Trust } from '../components/sections/Trust'
import { Features } from '../components/sections/Features'
import { Scanner } from '../components/sections/Scanner'
import { Testimonials } from '../components/sections/Testimonials'
import { FinalCTA } from '../components/sections/FinalCTA'

export function HomePage() {
  return (
    <>
      <Hero />
      <Trust />
      <Features />
      <Scanner />
      <Testimonials />
      <FinalCTA />
    </>
  )
}
