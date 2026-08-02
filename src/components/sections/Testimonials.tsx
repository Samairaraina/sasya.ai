import { Star } from 'lucide-react'
import { Marquee } from '../ui/Marquee'
import { SectionHeading } from '../../lib/animations'

const testimonials = [
  {
    name: 'Rajesh Kumar',
    place: 'Wheat Farmer, Punjab',
    text: 'Sasya detected bacterial leaf blight on my wheat two weeks before I would have. I saved nearly 4 tonnes of yield this season.',
    initials: 'RK',
    color: '#3DDC97',
  },
  {
    name: 'Lakshmi Devi',
    place: 'Organic Farmer, Karnataka',
    text: 'I talk to Sasya in my own language on voice. It feels like a field assistant who never sleeps. My input costs dropped 22%.',
    initials: 'LD',
    color: '#F38BBC',
  },
  {
    name: 'Arun Patel',
    place: 'Cotton Grower, Gujarat',
    text: 'The weather intelligence is unreal. Sasya warned me of unseasonal rain and I shifted my harvest — zero losses.',
    initials: 'AP',
    color: '#FFF2A6',
  },
  {
    name: 'Sunita Rao',
    place: 'Rice Farmer, Telangana',
    text: 'Government scheme matching helped me claim ₹34,000 in subsidies I didn\'t know existed. The report downloads are so clean.',
    initials: 'SR',
    color: '#F9B4D0',
  },
  {
    name: 'Mohan Das',
    place: 'Vegetable Grower, Tamil Nadu',
    text: 'Market intelligence tells me where to sell before I harvest. My prices went up 18% just by choosing the right mandi.',
    initials: 'MD',
    color: '#3DDC97',
  },
  {
    name: 'Priya Nair',
    place: 'Chilli Farmer, Maharashtra',
    text: 'The dashboard is beautiful and the AI recommendations are spot on. My farm now runs like a well-managed business.',
    initials: 'PN',
    color: '#F38BBC',
  },
]

function Card({ t }: { t: (typeof testimonials)[number] }) {
  return (
    <div className="w-[340px] shrink-0 rounded-3xl border border-white/10 bg-white/[0.03] p-7 backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:border-white/20 sm:w-[380px]">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className="text-butter" fill="currentColor" />
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-white/75">"{t.text}"</p>
      <div className="mt-6 flex items-center gap-3">
        <span
          className="grid h-11 w-11 place-items-center rounded-full font-display text-sm font-bold text-forest-950"
          style={{ background: t.color }}
        >
          {t.initials}
        </span>
        <div>
          <p className="text-sm font-semibold">{t.name}</p>
          <p className="text-xs text-white/50">{t.place}</p>
        </div>
      </div>
    </div>
  )
}

export function Testimonials() {
  return (
    <section id="about" className="relative overflow-hidden py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Farmer Stories"
          title={
            <>
              Loved by the people <span className="gradient-text">who feed the nation</span>.
            </>
          }
        />
      </div>

      <div className="mt-14 space-y-6 overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent, black 10%, black 90%, transparent)' }}>
        <Marquee>
          {testimonials.map((t) => (
            <Card key={t.name} t={t} />
          ))}
        </Marquee>
        <Marquee reverse>
          {[...testimonials].reverse().map((t) => (
            <Card key={t.name} t={t} />
          ))}
        </Marquee>
      </div>
    </section>
  )
}
