import { PageHero } from '../components/layout/PageShell'
import { ExpenseTracker } from '../components/sections/ExpenseTracker'
import { FinalCTA } from '../components/sections/FinalCTA'

export function ExpensesPage() {
  return (
    <>
      <PageHero
        eyebrow="Expense Tracking"
        title={
          <>
            Crop-wise cost sheets &amp; <span className="gradient-text">profit estimates</span>.
          </>
        }
        subtitle="Log what each crop costs and earns. Sasya computes per-acre profit so you know exactly what every acre of your farm is worth."
      />
      <ExpenseTracker />
      <FinalCTA />
    </>
  )
}
