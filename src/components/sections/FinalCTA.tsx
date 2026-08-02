import { motion } from 'framer-motion'
import { ScanLine } from 'lucide-react'
import { Button } from '../ui/MagneticButton'
import { MeshBackground } from '../ui/Ambient'
import { EASE } from '../../lib/animations'

export function FinalCTA() {
  return (
    <section id="cta" className="relative py-24 lg:py-36">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: EASE }}
          className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-forest-800 via-forest-900 to-forest-950 px-8 py-16 text-center shadow-card lg:px-16 lg:py-24"
        >
          <MeshBackground />
          <motion.div
            aria-hidden
            className="absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-blush-500/15 blur-3xl"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative">
            <motion.span
              className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ScanLine size={28} className="text-blush-400" />
            </motion.span>
            <h2 className="mx-auto mt-8 max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
              Ready to grow with <span className="gradient-text">intelligence?</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
              Join 48,000+ farmers already growing smarter. Scan your first crop leaf free —
              no card, no catch, just answers.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button to="/solutions" size="lg">
                <ScanLine size={18} />
                Start Free Scan
              </Button>
              <Button to="/contact" variant="ghost" size="lg">
                Talk to our team
              </Button>
            </div>
            <p className="mt-8 text-xs text-white/40">
              2-minute setup · Available in 9 Indian languages · Free forever plan
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
