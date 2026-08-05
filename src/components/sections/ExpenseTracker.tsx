import { useCallback, useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CirclePlus,
  IndianRupee,
  Leaf,
  Plus,
  Sprout,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { SectionHeading, Reveal, EASE } from '../../lib/animations'
import { supabase } from '../../lib/supabase'
import { useAuth } from '../../lib/auth'

type ExpenseCategory =
  | 'Seeds'
  | 'Fertilizer'
  | 'Labour'
  | 'Water'
  | 'Pesticides'
  | 'Machinery'
  | 'Transport'
  | 'Other'

const CATEGORIES: ExpenseCategory[] = [
  'Seeds',
  'Fertilizer',
  'Labour',
  'Water',
  'Pesticides',
  'Machinery',
  'Transport',
  'Other',
]

interface FarmRow {
  id: string
  name: string
  size_acres: number | null
}

interface CropRow {
  id: string
  farm_id: string
  name: string
  variety: string | null
}

interface ExpenseRow {
  id: string
  crop_id: string
  category: ExpenseCategory
  amount: number
  expense_date: string
  note: string | null
}

interface IncomeRow {
  id: string
  crop_id: string
  amount: number
  income_date: string
  source: string | null
  note: string | null
}

const inputClass =
  'w-full rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm text-white placeholder-white/35 outline-none transition-colors focus:border-blush-400/70 focus:bg-white/[0.08]'

const labelClass = 'mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/45'

function inr(n: number): string {
  return '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export function ExpenseTracker() {
  const { user } = useAuth()
  const [farms, setFarms] = useState<FarmRow[]>([])
  const [crops, setCrops] = useState<CropRow[]>([])
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null)
  const [expenses, setExpenses] = useState<ExpenseRow[]>([])
  const [incomes, setIncomes] = useState<IncomeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  // New-crop form
  const [cropName, setCropName] = useState('')
  const [cropVariety, setCropVariety] = useState('')

  // New expense form
  const [expCat, setExpCat] = useState<ExpenseCategory>('Seeds')
  const [expAmount, setExpAmount] = useState('')
  const [expDate, setExpDate] = useState('')
  const [expNote, setExpNote] = useState('')

  // New income form
  const [incAmount, setIncAmount] = useState('')
  const [incDate, setIncDate] = useState('')
  const [incSource, setIncSource] = useState('')
  const [incNote, setIncNote] = useState('')

  const flash = useCallback((msg: string) => {
    setNotice(msg)
    window.setTimeout(() => setNotice(null), 3000)
  }, [])

  // ── Load farms + crops for this user ────────────────────────────────────────
  useEffect(() => {
    const uid = user?.id
    if (!uid) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const { data: farmData, error: farmErr } = await supabase
          .from('farms')
          .select('id, name, size_acres')
          .eq('user_id', uid)
        if (farmErr) throw new Error(farmErr.message)

        let farmsList = (farmData ?? []) as FarmRow[]
        if (farmsList.length === 0) {
          const { data: created, error: createErr } = await supabase
            .from('farms')
            .insert({ user_id: uid, name: 'My Farm' })
            .select('id, name, size_acres')
            .single()
          if (createErr) throw new Error(createErr.message)
          farmsList = [created as FarmRow]
        }
        if (cancelled) return
        setFarms(farmsList)

        const { data: cropData, error: cropErr } = await supabase
          .from('crops')
          .select('id, farm_id, name, variety')
          .eq('user_id', uid)
          .order('created_at', { ascending: true })
        if (cropErr) throw new Error(cropErr.message)
        if (cancelled) return
        const cropList = (cropData ?? []) as CropRow[]
        setCrops(cropList)
        setSelectedCropId((prev) => (cropList.some((c) => c.id === prev) ? prev : cropList[0]?.id ?? null))
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load data.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  // ── Load entries for the selected crop ──────────────────────────────────────
  useEffect(() => {
    if (!selectedCropId) {
      setExpenses([])
      setIncomes([])
      return
    }
    let cancelled = false
    async function loadEntries() {
      const [expRes, incRes] = await Promise.all([
        supabase
          .from('crop_expenses')
          .select('*')
          .eq('crop_id', selectedCropId)
          .order('expense_date', { ascending: false }),
        supabase
          .from('crop_income')
          .select('*')
          .eq('crop_id', selectedCropId)
          .order('income_date', { ascending: false }),
      ])
      if (cancelled) return
      if (expRes.error) {
        setError(expRes.error.message)
        return
      }
      if (incRes.error) {
        setError(incRes.error.message)
        return
      }
      setExpenses((expRes.data ?? []) as ExpenseRow[])
      setIncomes((incRes.data ?? []) as IncomeRow[])
    }
    loadEntries()
    return () => {
      cancelled = true
    }
  }, [selectedCropId])

  const selectedCrop = useMemo(
    () => crops.find((c) => c.id === selectedCropId) ?? null,
    [crops, selectedCropId],
  )
  const selectedFarm = useMemo(
    () => farms.find((f) => f.id === selectedCrop?.farm_id) ?? null,
    [farms, selectedCrop],
  )

  const totals = useMemo(() => {
    const totalCost = expenses.reduce((s, e) => s + (e.amount ?? 0), 0)
    const totalIncome = incomes.reduce((s, i) => s + (i.amount ?? 0), 0)
    const profit = totalIncome - totalCost
    const acres = selectedFarm?.size_acres && selectedFarm.size_acres > 0 ? selectedFarm.size_acres : null
    return { totalCost, totalIncome, profit, profitPerAcre: acres ? profit / acres : null }
  }, [expenses, incomes, selectedFarm])

  const byCategory = useMemo(() => {
    const map = new Map<ExpenseCategory, number>()
    for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + (e.amount ?? 0))
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [expenses])

  // ── Mutations ───────────────────────────────────────────────────────────────
  async function addCrop(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !cropName.trim() || farms.length === 0) return
    setSaving(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('crops')
      .insert({
        user_id: user.id,
        farm_id: farms[0].id,
        name: cropName.trim(),
        variety: cropVariety.trim() || null,
      })
      .select('id, farm_id, name, variety')
      .single()
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setCrops((prev) => [...prev, data as CropRow])
    setSelectedCropId((data as CropRow).id)
    setCropName('')
    setCropVariety('')
    flash('Crop added.')
  }

  async function addExpense(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !selectedCropId || !expAmount) return
    const amount = Number(expAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a valid amount.')
      return
    }
    setSaving(true)
    setError(null)
    const { error: err } = await supabase.from('crop_expenses').insert({
      crop_id: selectedCropId,
      user_id: user.id,
      category: expCat,
      amount,
      expense_date: expDate ? new Date(expDate).toISOString() : new Date().toISOString(),
      note: expNote.trim() || null,
    })
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setExpAmount('')
    setExpDate('')
    setExpNote('')
    const { data } = await supabase
      .from('crop_expenses')
      .select('*')
      .eq('crop_id', selectedCropId)
      .order('expense_date', { ascending: false })
    if (!data) return
    setExpenses(data as ExpenseRow[])
    flash('Expense saved.')
  }

  async function addIncome(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !selectedCropId || !incAmount) return
    const amount = Number(incAmount)
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('Enter a valid amount.')
      return
    }
    setSaving(true)
    setError(null)
    const { error: err } = await supabase.from('crop_income').insert({
      crop_id: selectedCropId,
      user_id: user.id,
      amount,
      income_date: incDate ? new Date(incDate).toISOString() : new Date().toISOString(),
      source: incSource.trim() || null,
      note: incNote.trim() || null,
    })
    setSaving(false)
    if (err) {
      setError(err.message)
      return
    }
    setIncAmount('')
    setIncDate('')
    setIncSource('')
    setIncNote('')
    const { data } = await supabase
      .from('crop_income')
      .select('*')
      .eq('crop_id', selectedCropId)
      .order('income_date', { ascending: false })
    if (!data) return
    setIncomes(data as IncomeRow[])
    flash('Income saved.')
  }

  async function deleteExpense(id: string) {
    const { error: err } = await supabase.from('crop_expenses').delete().eq('id', id)
    if (err) {
      setError(err.message)
      return
    }
    setExpenses((prev) => prev.filter((e) => e.id !== id))
    flash('Expense removed.')
  }

  async function deleteIncome(id: string) {
    const { error: err } = await supabase.from('crop_income').delete().eq('id', id)
    if (err) {
      setError(err.message)
      return
    }
    setIncomes((prev) => prev.filter((i) => i.id !== id))
    flash('Income removed.')
  }

  const maxCost = Math.max(totals.totalCost, 1)

  return (
    <section id="expenses" className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHeading
          eyebrow="Expense Tracking"
          title={
            <>
              Know exactly what <span className="gradient-text">every acre earns</span>.
            </>
          }
          subtitle="Log inputs, labour and harvest sales per crop. Sasya rolls it up into cost sheets and profit estimates — so you can see what's working."
        />

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: EASE }}
          className="relative mt-16 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-6 shadow-card backdrop-blur lg:p-8"
        >
          {notice && (
            <div className="mb-5 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-200">
              {notice}
            </div>
          )}
          {error && (
            <div className="mb-5 rounded-xl border border-blush-500/30 bg-blush-500/10 px-4 py-2.5 text-sm text-blush-300">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid place-items-center py-24 text-sm text-white/50">Loading your crops…</div>
          ) : crops.length === 0 ? (
            <div className="py-12">
              <div className="mx-auto max-w-md text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.05]">
                  <Sprout size={24} className="text-emerald-300" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold">Start with a crop</h3>
                <p className="mt-2 text-sm text-white/55">
                  Add your first crop to begin tracking its inputs and income.
                </p>
                <form onSubmit={addCrop} className="mt-6 space-y-3">
                  <input
                    className={inputClass}
                    placeholder="Crop name (e.g. Tomato)"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                  />
                  <input
                    className={inputClass}
                    placeholder="Variety (optional)"
                    value={cropVariety}
                    onChange={(e) => setCropVariety(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={saving || !cropName.trim()}
                    className="btn-primary inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={16} /> Add crop
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <>
              {/* Crop selector + inline add */}
              <div className="flex flex-wrap items-center gap-2">
                {crops.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCropId(c.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                      selectedCropId === c.id
                        ? 'bg-emerald-400/15 text-emerald-200 ring-1 ring-emerald-400/40'
                        : 'border border-white/10 text-white/55 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <Leaf size={12} />
                    {c.name}
                    {c.variety ? ` · ${c.variety}` : ''}
                  </button>
                ))}
                <form onSubmit={addCrop} className="flex items-center gap-2">
                  <input
                    className="w-32 rounded-full border border-white/15 bg-white/[0.05] px-3 py-1.5 text-xs text-white placeholder-white/35 outline-none focus:border-blush-400/70"
                    placeholder="Add crop…"
                    value={cropName}
                    onChange={(e) => setCropName(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={saving || !cropName.trim()}
                    aria-label="Add crop"
                    className="grid h-8 w-8 place-items-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-emerald-400/50 hover:text-emerald-300 disabled:opacity-40"
                  >
                    <CirclePlus size={15} />
                  </button>
                </form>
              </div>

              {selectedCrop ? (
                <>
                  {/* Summary strip */}
                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                      icon={<ArrowDownCircle size={18} className="text-blush-400" />}
                      label="Total invested"
                      value={inr(totals.totalCost)}
                      sub={selectedFarm?.name ?? 'Farm'}
                    />
                    <SummaryCard
                      icon={<ArrowUpCircle size={18} className="text-emerald-300" />}
                      label="Total earned"
                      value={inr(totals.totalIncome)}
                      sub="Harvest & sales"
                    />
                    <SummaryCard
                      icon={<TrendingUp size={18} className="text-butter" />}
                      label="Net profit"
                      value={inr(totals.profit)}
                      sub={totals.profit >= 0 ? 'Profit' : 'Loss'}
                      tone={totals.profit >= 0 ? 'up' : 'down'}
                    />
                    <SummaryCard
                      icon={<IndianRupee size={18} className="text-emerald-300" />}
                      label="Profit / acre"
                      value={
                        totals.profitPerAcre !== null
                          ? inr(totals.profitPerAcre)
                          : '—'
                      }
                      sub={
                        selectedFarm?.size_acres
                          ? `${selectedFarm.size_acres} acres`
                          : 'Add farm size for per-acre math'
                      }
                    />
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    {/* Cost sheet */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                      <div className="flex items-center gap-2">
                        <Wallet size={15} className="text-blush-400" />
                        <h3 className="font-display text-sm font-bold">Cost sheet — {selectedCrop.name}</h3>
                      </div>

                      {byCategory.length === 0 ? (
                        <p className="mt-6 text-sm text-white/40">
                          No expenses logged yet. Add seeds, fertilizer, labour or anything else below.
                        </p>
                      ) : (
                        <div className="mt-5 space-y-4">
                          {byCategory.map(([cat, amt]) => (
                            <div key={cat}>
                              <div className="mb-1.5 flex items-center justify-between text-xs">
                                <span className="text-white/60">{cat}</span>
                                <span className="font-medium text-white/80">{inr(amt)}</span>
                              </div>
                              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                                <motion.div
                                  initial={{ width: 0 }}
                                  whileInView={{ width: `${Math.max(4, (amt / maxCost) * 100)}%` }}
                                  viewport={{ once: true }}
                                  transition={{ duration: 0.9, ease: EASE }}
                                  className="h-full rounded-full bg-gradient-to-r from-blush-500 to-blush-400"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {expenses.length > 0 && (
                        <ul className="mt-6 space-y-1.5 border-t border-white/[0.07] pt-4">
                          {expenses.slice(0, 8).map((e) => (
                            <li
                              key={e.id}
                              className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-xs text-white/65 hover:bg-white/[0.04]"
                            >
                              <span className="min-w-0">
                                <span className="font-medium text-white/85">{e.category}</span>
                                {e.note ? ` — ${e.note}` : ''}
                                <span className="ml-2 text-white/35">
                                  {new Date(e.expense_date).toLocaleDateString('en-IN')}
                                </span>
                              </span>
                              <span className="flex items-center gap-2 whitespace-nowrap">
                                <span className="text-white/85">{inr(e.amount)}</span>
                                <button
                                  onClick={() => deleteExpense(e.id)}
                                  aria-label="Delete expense"
                                  className="text-white/30 transition-colors hover:text-blush-400"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Income */}
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={15} className="text-emerald-300" />
                        <h3 className="font-display text-sm font-bold">Income — {selectedCrop.name}</h3>
                      </div>

                      {incomes.length === 0 ? (
                        <p className="mt-6 text-sm text-white/40">
                          No income logged yet. Record harvest sales or contract payouts as they come in.
                        </p>
                      ) : (
                        <ul className="mt-5 space-y-1.5">
                          {incomes.map((i) => (
                            <li
                              key={i.id}
                              className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-xs text-white/65 hover:bg-white/[0.04]"
                            >
                              <span className="min-w-0">
                                <span className="font-medium text-emerald-200/90">{i.source ?? 'Sale'}</span>
                                {i.note ? ` — ${i.note}` : ''}
                                <span className="ml-2 text-white/35">
                                  {new Date(i.income_date).toLocaleDateString('en-IN')}
                                </span>
                              </span>
                              <span className="flex items-center gap-2 whitespace-nowrap">
                                <span className="text-emerald-200/90">{inr(i.amount)}</span>
                                <button
                                  onClick={() => deleteIncome(i.id)}
                                  aria-label="Delete income"
                                  className="text-white/30 transition-colors hover:text-blush-400"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Add expense form */}
                    <form
                      onSubmit={addExpense}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                    >
                      <h3 className="flex items-center gap-2 font-display text-sm font-bold">
                        <ArrowDownCircle size={15} className="text-blush-400" />
                        Log an expense
                      </h3>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className={labelClass}>Category</label>
                          <select
                            className={inputClass}
                            value={expCat}
                            onChange={(e) => setExpCat(e.target.value as ExpenseCategory)}
                          >
                            {CATEGORIES.map((c) => (
                              <option key={c} value={c} className="bg-forest-900">
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className={labelClass}>Amount (₹)</label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            className={inputClass}
                            placeholder="0"
                            value={expAmount}
                            onChange={(e) => setExpAmount(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Date</label>
                          <input
                            type="date"
                            className={`${inputClass} [color-scheme:dark]`}
                            value={expDate}
                            onChange={(e) => setExpDate(e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className={labelClass}>Note (optional)</label>
                          <input
                            className={inputClass}
                            placeholder="e.g. 2 bags of DAP"
                            value={expNote}
                            onChange={(e) => setExpNote(e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={saving || !expAmount}
                        className="btn-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus size={15} /> Save expense
                      </button>
                    </form>

                    {/* Add income form */}
                    <form
                      onSubmit={addIncome}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                    >
                      <h3 className="flex items-center gap-2 font-display text-sm font-bold">
                        <ArrowUpCircle size={15} className="text-emerald-300" />
                        Log income
                      </h3>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        <div>
                          <label className={labelClass}>Amount (₹)</label>
                          <input
                            type="number"
                            min="0"
                            step="any"
                            className={inputClass}
                            placeholder="0"
                            value={incAmount}
                            onChange={(e) => setIncAmount(e.target.value)}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Date</label>
                          <input
                            type="date"
                            className={`${inputClass} [color-scheme:dark]`}
                            value={incDate}
                            onChange={(e) => setIncDate(e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className={labelClass}>Source (optional)</label>
                          <input
                            className={inputClass}
                            placeholder="e.g. APMC Nashik mandi sale"
                            value={incSource}
                            onChange={(e) => setIncSource(e.target.value)}
                          />
                        </div>
                        <div className="col-span-2">
                          <label className={labelClass}>Note (optional)</label>
                          <input
                            className={inputClass}
                            placeholder="e.g. 40 boxes @ ₹280"
                            value={incNote}
                            onChange={(e) => setIncNote(e.target.value)}
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={saving || !incAmount}
                        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-300 px-6 py-2.5 text-sm font-semibold text-forest-950 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Plus size={15} /> Save income
                      </button>
                    </form>
                  </div>
                </>
              ) : null}
            </>
          )}
        </motion.div>

        <Reveal className="mt-10 text-center text-xs text-white/35">
          Data stays yours — protected by per-user row-level security. Change your farm size on the
          dashboard to refine per-acre estimates.
        </Reveal>
      </div>
    </section>
  )
}

function SummaryCard({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  tone?: 'up' | 'down'
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-2 text-sm text-white/50">
        {icon}
        {label}
      </div>
      <p
        className={`mt-3 font-display text-2xl font-bold ${
          tone === 'down' ? 'text-blush-400' : 'text-white'
        }`}
      >
        {value}
      </p>
      <p className="mt-1 truncate text-xs text-white/35">{sub}</p>
    </div>
  )
}
