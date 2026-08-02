import { useCallback, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Camera,
  CheckCircle2,
  Download,
  ImagePlus,
  Leaf,
  Save,
  ScanLine,
  Share2,
  Sparkles,
  Upload,
} from 'lucide-react'
import { SectionHeading, EASE } from '../../lib/animations'

const steps = [
  { label: 'Uploading image', dur: 900 },
  { label: 'Scanning image', dur: 1100 },
  { label: 'Finding disease', dur: 1300 },
  { label: 'Comparing database', dur: 1200 },
  { label: 'Generating AI report', dur: 1500 },
]

const DEMO_LEAF = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#0d2624"/><g opacity="0.9"><circle cx="200" cy="150" r="120" fill="#2f6b63"/><path d="M200 60 C150 110 145 190 200 250 C255 190 250 110 200 60 Z" fill="#1f9d6b"/><path d="M200 90 C185 130 185 170 200 210" stroke="#fff" stroke-width="2.5" fill="none" opacity="0.7"/><path d="M200 130 C175 140 168 155 168 175" stroke="#fff" stroke-width="2" fill="none" opacity="0.6"/><path d="M200 130 C225 140 232 155 232 175" stroke="#fff" stroke-width="2" fill="none" opacity="0.6"/><circle cx="168" cy="175" r="9" fill="#5b3a1a" opacity="0.9"/><circle cx="190" cy="160" r="7" fill="#5b3a1a" opacity="0.85"/><circle cx="232" cy="175" r="8" fill="#5b3a1a" opacity="0.9"/><circle cx="205" cy="195" r="6" fill="#5b3a1a" opacity="0.8"/><path d="M80 320 Q200 280 320 320 L300 340 Q200 310 100 340 Z" fill="#173b3a"/></g></svg>`,
)}`

type Stage = 'idle' | 'processing' | 'done'

const result = {
  disease: 'Early Blight (Alternaria solani)',
  confidence: 96.4,
  severity: 'Moderate',
  symptoms: 'Dark brown spots with concentric rings on lower leaves, yellowing around lesions.',
  causes: 'Fungal spores spread by rain splash, high humidity above 85%, night temperatures 15-20°C.',
  organic: 'Spray neem oil 3% + baking soda solution weekly. Remove and destroy infected leaves.',
  chemical: 'Mancozeb 75% WP @ 2.5g/L or Chlorothalonil @ 2g/L every 10-14 days.',
  fertilizer: 'Balanced NPK 19:19:19 @ 2kg/acre after treatment. Add micronutrient mix.',
  recovery: '10–14 days',
  experts: [
    { name: 'Dr. Meera Sharma', role: 'Plant Pathologist, KVK Pune', rating: 4.9 },
    { name: 'Ramesh Patil', role: 'Senior Agronomist, 22 yrs exp', rating: 4.8 },
  ],
}

export function Scanner() {
  const [stage, setStage] = useState<Stage>('idle')
  const [stepIdx, setStepIdx] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const start = useCallback(() => {
    setStage('processing')
    setStepIdx(0)
    steps.forEach((s, i) => {
      setTimeout(() => setStepIdx(i), s.dur)
    })
    const total = steps.reduce((a, s) => a + s.dur, 0)
    setTimeout(() => setStage('done'), total + 400)
  }, [])

  const onFile = useCallback(
    (file?: File) => {
      if (!file) return
      const url = URL.createObjectURL(file)
      setPreview(url)
      start()
    },
    [start],
  )

  const onCamera = useCallback(() => {
    setPreview(DEMO_LEAF)
    start()
  }, [start])

  const reset = useCallback(() => {
    setStage('idle')
    setPreview(null)
    setStepIdx(0)
  }, [])

  return (
    <section id="solutions" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="AI Scanner"
          title={
            <>
              Detect disease in <span className="gradient-text">seconds</span>.
            </>
          }
          subtitle="Point, capture, scan. Sasya's computer-vision engine reads your crop's health and hands you a complete action plan."
        />

        <div className="mt-16 grid items-start gap-8 lg:grid-cols-2">
          {/* Left - upload / scan */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur lg:p-10"
          >
            <div
              className={`relative grid min-h-[380px] place-items-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
                dragging ? 'border-blush-400 bg-blush-500/10 scale-[1.01]' : 'border-white/15 bg-forest-950/40'
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                onFile(e.dataTransfer.files?.[0])
              }}
            >
              <AnimatePresence mode="wait">
                {stage === 'idle' && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center gap-5 text-center"
                  >
                    <motion.span
                      className="grid h-20 w-20 place-items-center rounded-full border border-white/10 bg-gradient-to-br from-blush-500/20 to-emerald-400/20"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      {preview ? (
                        <img src={preview} alt="Upload preview" className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <ImagePlus size={30} className="text-blush-400" />
                      )}
                    </motion.span>
                    <div>
                      <p className="font-display text-lg font-bold">Drag & drop your leaf photo</p>
                      <p className="mt-1 text-sm text-white/50">or tap to browse your gallery</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <button
                        onClick={() => inputRef.current?.click()}
                        className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold"
                      >
                        <Upload size={15} /> Upload
                      </button>
                      <button
                        onClick={onCamera}
                        className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
                      >
                        <Camera size={15} /> Camera
                      </button>
                      <button
                        onClick={() => inputRef.current?.click()}
                        className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
                      >
                        <ImagePlus size={15} /> Gallery
                      </button>
                    </div>
                    <input
                      ref={inputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => onFile(e.target.files?.[0])}
                    />
                  </motion.div>
                )}

                {stage === 'processing' && (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex w-full flex-col items-center gap-6 px-4"
                  >
                    <div className="relative grid h-44 w-44 place-items-center">
                      <motion.span
                        className="absolute inset-0 rounded-full border-2 border-dashed border-blush-400/60"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                      />
                      <motion.span
                        className="absolute inset-3 rounded-full border border-emerald-400/30"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      />
                      <motion.div
                        className="relative grid h-24 w-24 place-items-center overflow-hidden rounded-2xl bg-forest-950"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {preview ? (
                          <img src={preview} alt="Scanning" className="h-full w-full object-cover" />
                        ) : (
                          <Leaf className="text-emerald-400" size={36} />
                        )}
                        <motion.span
                          className="scanline absolute inset-x-2 h-0.5 bg-blush-400"
                          style={{ boxShadow: '0 0 12px rgba(243,139,188,.8)' }}
                        />
                      </motion.div>
                    </div>

                    <div className="w-full max-w-xs">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={stepIdx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="text-center text-sm font-medium text-white/80"
                        >
                          {steps[stepIdx]?.label}...
                        </motion.p>
                      </AnimatePresence>
                      <div className="mt-3 flex gap-1.5">
                        {steps.map((s, i) => (
                          <motion.span
                            key={s.label}
                            className="h-1 flex-1 rounded-full bg-white/10"
                            initial={false}
                            animate={{
                              background:
                                i < stepIdx
                                  ? 'linear-gradient(90deg,#3DDC97,#F38BBC)'
                                  : i === stepIdx
                                    ? 'rgba(243,139,188,.7)'
                                    : 'rgba(255,255,255,.1)',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {stage === 'done' && (
                  <motion.div
                    key="done"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="flex flex-col items-center gap-4 text-center"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 12 }}
                      className="grid h-20 w-20 place-items-center rounded-full bg-emerald-400/20"
                    >
                      <CheckCircle2 size={40} className="text-emerald-300" />
                    </motion.span>
                    <div>
                      <p className="font-display text-xl font-bold">Diagnosis complete</p>
                      <p className="mt-1 text-sm text-white/55">
                        Full treatment report generated for {result.disease.split('(')[0].trim()}.
                      </p>
                    </div>
                    <button onClick={reset} className="text-sm font-medium text-blush-400 hover:underline">
                      ← Scan another leaf
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right - results */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent p-8 backdrop-blur lg:p-10"
          >
            <AnimatePresence mode="wait">
              {stage === 'done' ? (
                <motion.div
                  key="report"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-blush-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-blush-400">
                          AI Report
                        </span>
                        <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                          {result.severity} severity
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-2xl font-bold">{result.disease}</h3>
                    </div>
                    <div className="text-right">
                      <p className="stat-font text-4xl font-bold text-emerald-300">
                        {result.confidence}%
                      </p>
                      <p className="text-xs text-white/50">Confidence</p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {[
                      { t: 'Symptoms', v: result.symptoms },
                      { t: 'Possible Causes', v: result.causes },
                      { t: 'Organic Treatment', v: result.organic, accent: true },
                      { t: 'Chemical Treatment', v: result.chemical, accent: true },
                      { t: 'Recommended Fertilizer', v: result.fertilizer },
                      { t: 'Estimated Recovery', v: `${result.recovery} with consistent treatment`, accent: true },
                    ].map((b) => (
                      <div
                        key={b.t}
                        className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                      >
                        <p className={`text-[11px] font-semibold uppercase tracking-wider ${b.accent ? 'text-blush-400' : 'text-emerald-300'}`}>
                          {b.t}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-white/70">{b.v}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
                      Nearby Experts
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      {result.experts.map((e) => (
                        <div key={e.name} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blush-500/40 to-emerald-400/40 font-display text-sm font-bold">
                            {e.name.split(' ').map((w) => w[0]).join('')}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{e.name}</p>
                            <p className="truncate text-xs text-white/50">{e.role}</p>
                          </div>
                          <span className="ml-auto text-xs font-semibold text-butter">★ {e.rating}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {[
                      { icon: Save, label: 'Save Report' },
                      { icon: Download, label: 'Download PDF' },
                      { icon: Share2, label: 'Share' },
                    ].map((b) => (
                      <button
                        key={b.label}
                        className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.05] px-4 py-2 text-sm font-medium transition-all hover:bg-white/10 hover:-translate-y-0.5"
                      >
                        <b.icon size={14} className="text-blush-400" />
                        {b.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -16 }}
                  className="flex min-h-[380px] flex-col items-center justify-center gap-4 text-center"
                >
                  <motion.span
                    className="grid h-16 w-16 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]"
                    animate={{ rotate: [0, 6, -6, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles size={26} className="text-blush-400" />
                  </motion.span>
                  <div>
                    <p className="font-display text-xl font-bold">Your AI report appears here</p>
                    <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-white/50">
                      Upload a leaf photo to unlock the full diagnosis — disease, treatments,
                      fertilizer plan and nearby experts.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
