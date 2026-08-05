import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Camera, Check, ChevronDown, Globe, LogOut,
  MapPin, Phone, Save, User, X,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Profile {
  id: string
  email: string
  name: string | null
  phone: string | null
  role: string
  language: string | null
  location: string | null
  profile_image: string | null
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
]

const ROLES = ['FARMER', 'EXPERT', 'ADMIN']

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 36 }: { src?: string | null; name?: string | null; size?: number }) {
  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?'
  return src ? (
    <img
      src={src}
      alt={name ?? 'Profile'}
      style={{ width: size, height: size }}
      className="rounded-full object-cover ring-2 ring-blush-400/40"
    />
  ) : (
    <span
      style={{ width: size, height: size, fontSize: size * 0.35 }}
      className="inline-grid place-items-center rounded-full bg-gradient-to-br from-blush-500/60 to-emerald-400/60 font-bold text-white ring-2 ring-blush-400/30"
    >
      {initials}
    </span>
  )
}

// ─── Profile Modal ────────────────────────────────────────────────────────────
function ProfileModal({ onClose }: { onClose: () => void }) {
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [imgPreview, setImgPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Fetch full profile on open
  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setProfile(data as Profile)
        setLoading(false)
      })
  }, [user])

  function field<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((p) => (p ? { ...p, [key]: value } : p))
  }

  async function handleSave() {
    if (!profile || !user) return
    setSaving(true)
    await supabase.from('profiles').upsert({
      id: user.id,
      name: profile.name,
      phone: profile.phone,
      role: profile.role,
      language: profile.language,
      location: profile.location,
      profile_image: imgPreview ?? profile.profile_image,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleImageFile(file?: File) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImgPreview(String(reader.result))
    reader.readAsDataURL(file)
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />

      {/* Panel */}
      <motion.div
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-forest-950 shadow-2xl"
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-br from-forest-800 to-forest-900 px-8 pb-8 pt-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blush-500/10 to-emerald-400/5" />
          <button
            onClick={onClose}
            className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-white/[0.06] text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <X size={15} />
          </button>

          <div className="relative flex items-center gap-5">
            {/* Avatar with upload */}
            <div className="relative shrink-0">
              <Avatar
                src={imgPreview ?? profile?.profile_image}
                name={profile?.name}
                size={72}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full border-2 border-forest-900 bg-blush-500 text-white shadow transition hover:bg-blush-400"
                title="Change photo"
              >
                <Camera size={13} />
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageFile(e.target.files?.[0])}
              />
            </div>

            <div>
              <p className="font-display text-xl font-bold">
                {profile?.name ?? 'Your Profile'}
              </p>
              <p className="mt-0.5 text-sm text-white/50">{user?.email}</p>
              <span className="mt-2 inline-block rounded-full bg-emerald-400/15 px-3 py-0.5 text-[11px] font-semibold text-emerald-300">
                {profile?.role ?? 'FARMER'}
              </span>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="px-8 py-7">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-white/[0.05]" />
              ))}
            </div>
          ) : profile ? (
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  <User size={11} /> Full Name
                </label>
                <input
                  value={profile.name ?? ''}
                  onChange={(e) => field('name', e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-blush-400/60 focus:ring-1 focus:ring-blush-400/30"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  <Phone size={11} /> Phone Number
                </label>
                <input
                  value={profile.phone ?? ''}
                  onChange={(e) => field('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-blush-400/60 focus:ring-1 focus:ring-blush-400/30"
                />
              </div>

              {/* Location */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                  <MapPin size={11} /> Location / Village
                </label>
                <input
                  value={profile.location ?? ''}
                  onChange={(e) => field('location', e.target.value)}
                  placeholder="e.g. Nashik, Maharashtra"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-blush-400/60 focus:ring-1 focus:ring-blush-400/30"
                />
              </div>

              {/* Language + Role side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/50">
                    <Globe size={11} /> Language
                  </label>
                  <select
                    value={profile.language ?? 'en'}
                    onChange={(e) => field('language', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-forest-900 px-4 py-3 text-sm text-white outline-none transition focus:border-blush-400/60"
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/50 flex items-center gap-1.5">
                    <User size={11} /> Role
                  </label>
                  <select
                    value={profile.role ?? 'FARMER'}
                    onChange={(e) => field('role', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-forest-900 px-4 py-3 text-sm text-white outline-none transition focus:border-blush-400/60"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                  Email (cannot change)
                </label>
                <input
                  value={profile.email}
                  readOnly
                  className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-white/30 outline-none cursor-not-allowed"
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.06] px-8 py-5">
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/50 transition hover:bg-white/[0.06] hover:text-white"
          >
            <LogOut size={14} /> Sign out
          </button>

          <button
            onClick={handleSave}
            disabled={saving || !profile}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blush-500 to-blush-600 px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:opacity-90 disabled:opacity-50"
          >
            {saved ? (
              <><Check size={14} /> Saved!</>
            ) : saving ? (
              'Saving…'
            ) : (
              <><Save size={14} /> Save Profile</>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Profile Dropdown (in navbar) ─────────────────────────────────────────────
export function ProfileDropdown() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [profileName, setProfileName] = useState<string | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  // Fetch profile_image for avatar
  useEffect(() => {
    if (!user) return
    supabase
      .from('profiles')
      .select('profile_image, name')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        setProfileImage(data?.profile_image ?? null)
        setProfileName(data?.name ?? null)
      })
  }, [user])

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!user) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pl-1 pr-3 transition hover:bg-white/10"
      >
        <Avatar src={profileImage} name={profileName ?? user.email} size={28} />
        <span className="hidden max-w-[110px] truncate text-[12px] font-medium text-white/70 md:block">
          {profileName ?? user.email?.split('@')[0]}
        </span>
        <ChevronDown
          size={13}
          className={`text-white/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-white/10 bg-forest-900 shadow-2xl backdrop-blur-xl"
          >
            {/* User info */}
            <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
              <Avatar src={profileImage} name={profileName ?? user.email} size={36} />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{profileName ?? 'Farmer'}</p>
                <p className="truncate text-[11px] text-white/40">{user.email}</p>
              </div>
            </div>

            {/* Menu */}
            <div className="p-2">
              <button
                onClick={() => { setOpen(false); document.dispatchEvent(new CustomEvent('open-profile')) }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-white/70 transition hover:bg-white/[0.07] hover:text-white"
              >
                <User size={14} className="text-blush-400" />
                Edit Profile
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile modal — listens to custom event */}
      <ProfileModalListener />
    </div>
  )
}

// Listens for open-profile event
function ProfileModalListener() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const handler = () => setOpen(true)
    document.addEventListener('open-profile', handler)
    return () => document.removeEventListener('open-profile', handler)
  }, [])
  return (
    <AnimatePresence>
      {open && <ProfileModal onClose={() => setOpen(false)} />}
    </AnimatePresence>
  )
}
