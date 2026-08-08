import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, ImagePlus, Mic, Send, Sparkles, X } from 'lucide-react'
import { EASE } from '../../lib/animations'
import { geminiChat, hasGeminiKey } from '../../lib/gemini'

const suggested = [
  'My tomato leaves are turning yellow',
  'Best time to sow wheat?',
  'Market price for chilli today',
  'How to treat powdery mildew?',
]

const replies: Record<string, string[]> = {
  'My tomato leaves are turning yellow': [
    'I can help with that! Based on your description, here\'s the likely diagnosis:',
    '🔬 Likely: Nitrogen deficiency or early-stage fungal infection.',
    'Cause: Yellowing on lower leaves usually means nitrogen deficiency; yellowing with brown spots suggests early blight.',
    'Treatment: Apply NPK 20:10:10 foliar spray @ 5g/L. If spots are present, spray mancozeb @ 2.5g/L.',
    'Weather tip: Humidity above 80% worsens fungal spread — keep airflow open.',
    'Fertilizer: Urea 1% foliar spray this week, then recheck in 7 days.',
  ],
  'Best time to sow wheat?': [
    'Great question! 🌾',
    'Optimal sowing window: Mid-October to mid-November for North India.',
    'Soil temp should be 20–25°C. For late sowing, increase seed rate by 20%.',
    'Recommended variety for your region: HD-3086 (resistant to rust).',
  ],
  'Market price for chilli today': [
    'Here\'s today\'s chilli market intelligence 📈',
    'Lasalgaon: ₹31/kg · Avg ₹29.5/kg',
    'Demand is up 6% this week — prices trending higher.',
    'Tip: Hold stock for 2 days; futures indicate a ₹2–3/kg rise.',
  ],
  'How to treat powdery mildew?': [
    'Powdery mildew — I\'ve got a plan for that 🍃',
    'Symptoms: White powdery coating on upper leaf surface.',
    'Organic: 2% baking soda + neem oil weekly spray.',
    'Chemical: Sulphur 80% WG @ 2g/L every 10 days.',
    'Avoid overhead irrigation; apply at early morning.',
  ],
}

function useTyping(text: string, onComplete: () => void) {
  const [idx, setIdx] = useState(0)
  const doneRef = useRef(false)
  useEffect(() => {
    doneRef.current = false
    setIdx(0)
  }, [text])
  useEffect(() => {
    if (idx >= text.length) {
      if (!doneRef.current) {
        doneRef.current = true
        onComplete()
      }
      return
    }
    const t = setTimeout(() => setIdx((i) => i + 1), 8)
    return () => clearTimeout(t)
  }, [idx, text, onComplete])
  return text.slice(0, idx)
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ from: 'bot' | 'user'; text: string }[]>([
    { from: 'bot', text: 'Namaste! 🌱 I\'m Sasya AI. Ask me anything about your crops, weather or market.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [pending, setPending] = useState<string[]>([])
  const [live, setLive] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const busyRef = useRef(false)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  const ask = (q: string) => {
    if (!q.trim() || busyRef.current) return
    busyRef.current = true
    setMessages((m) => [...m, { from: 'user', text: q }])
    setInput('')
    setTyping(true)

    const fallback = (reply: string[]) => {
      setLive(false)
      setTyping(false)
      setPending(reply)
    }

    if (!hasGeminiKey()) {
      const reply = replies[q] ?? [
        'Great question! For personalized answers, take a crop photo in the scanner — I can give you an exact diagnosis and treatment plan.',
      ]
      setTimeout(() => fallback(reply), 700)
      busyRef.current = false
      return
    }

    setLive(true)
    const history = messages
      .filter((m) => m.from === 'user' || m.from === 'bot')
      .slice(-10)
      .map((m) => ({ role: (m.from === 'user' ? 'user' : 'model') as 'user' | 'model', text: m.text }))
      .concat([{ role: 'user' as const, text: q }])

    geminiChat(history)
      .then((text) => {
        setTyping(false)
        setPending(text.split('\n').filter((l) => l.trim()))
      })
      .catch(() => {
        fallback([
          'Sorry, I could not reach the AI right now. ' +
            (replies[q] ?? 'You can try again, or take a crop photo in the scanner for an instant diagnosis.'),
        ])
      })
      .finally(() => {
        busyRef.current = false
      })
  }

  const handleLineDone = () => {
    setMessages((m) => [...m, { from: 'bot', text: pending[0] }])
    setPending((p) => p.slice(1))
  }

  return (
    <>
      {/* Floating launcher */}
      <motion.button
        onClick={() => setOpen(!open)}
        aria-label="Chat with Sasya AI"
        className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-blush-500 to-blush-400 text-forest-950 shadow-glow"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'x' : 'bot'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid place-items-center"
          >
            {open ? <X size={22} /> : <MessageCircle size={24} />}
          </motion.span>
        </AnimatePresence>
        {!open && (
          <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-full border-2 border-forest-900 bg-emerald-400" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[calc(100vw-3rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-white/15 bg-forest-950/95 shadow-card backdrop-blur-xl"
            style={{ boxShadow: '0 30px 80px -20px rgba(0,0,0,.7)' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-5 py-4">
              <span className="relative grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-blush-500 to-blush-400">
                <MessageCircle size={20} className="text-forest-950" />
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-forest-950 bg-emerald-400" />
              </span>
              <div>
                <p className="flex items-center gap-1.5 text-sm font-semibold">
                  Sasya AI <Sparkles size={12} className="text-blush-400" />
                </p>
                <p className="text-[11px] text-emerald-300">
                  {live ? 'Online · live Groq AI' : 'Online · replies instantly'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
                      m.from === 'user'
                        ? 'rounded-br-md bg-gradient-to-r from-blush-500 to-blush-400 font-medium text-forest-950'
                        : 'rounded-bl-md border border-white/10 bg-white/[0.06] text-white/85'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-blush-400"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </div>
                </div>
              )}
              {pending.length > 0 && !typing && (
                <PendingReplies key={pending[0]} stream={pending} onDone={handleLineDone} />
              )}
            </div>

            {/* Suggested */}
            <div className="flex gap-2 overflow-x-auto px-4 pb-2" style={{ scrollbarWidth: 'none' }}>
              {suggested.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[11px] text-white/65 transition-colors hover:border-blush-500/40 hover:text-blush-400"
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-white/10 bg-white/[0.03] px-3 py-3">
              <button aria-label="Attach image" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/55 transition-colors hover:text-blush-400">
                <ImagePlus size={17} />
              </button>
              <button aria-label="Voice input" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white/55 transition-colors hover:text-blush-400">
                <Mic size={17} />
              </button>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && ask(input)}
                placeholder="Ask anything..."
                className="h-10 flex-1 rounded-full border border-white/10 bg-forest-950/70 px-4 text-[13px] text-white placeholder-white/35 outline-none transition-colors focus:border-blush-400/50"
              />
              <motion.button
                onClick={() => ask(input)}
                aria-label="Send"
                whileTap={{ scale: 0.85 }}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blush-500 to-blush-400 text-forest-950"
              >
                <Send size={15} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function PendingReplies({ stream, onDone }: { stream: string[]; onDone: () => void }) {
  const text = useTyping(stream[0] ?? '', onDone)
  if (!stream[0]) return null
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] whitespace-pre-line rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.06] px-4 py-2.5 text-[13px] leading-relaxed text-white/85">
        {text}
      </div>
    </div>
  )
}
