import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { Wallet, Activity, TrendingUp, TrendingDown } from 'lucide-react'

// --- Mock Data ---
const financeData = [
  { name: 'Jan', income: 4000, expense: 2400 },
  { name: 'Feb', income: 3000, expense: 1398 },
  { name: 'Mar', income: 2000, expense: 9800 },
  { name: 'Apr', income: 2780, expense: 3908 },
  { name: 'May', income: 1890, expense: 4800 },
  { name: 'Jun', income: 2390, expense: 3800 },
  { name: 'Jul', income: 3490, expense: 4300 },
]

const diseaseData = [
  { name: 'Healthy', value: 72 },
  { name: 'Diseased', value: 28 },
]
const PIE_COLORS = ['#34d399', '#f87171']

const diseaseTrendData = [
  { name: 'W1', cases: 2 },
  { name: 'W2', cases: 5 },
  { name: 'W3', cases: 3 },
  { name: 'W4', cases: 8 },
]

export function FinanceAnalyticsWidget({ totalIncome, totalExpense }: { totalIncome: number, totalExpense: number }) {
  const profit = totalIncome - totalExpense
  const profitMargin = totalIncome > 0 ? ((profit / totalIncome) * 100).toFixed(1) : '0'

  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 lg:p-8 lg:col-span-2 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
          <Wallet size={16} className="text-emerald-400" />
          Finance Analytics
        </div>
        <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-xs text-white/70 outline-none focus:border-white/20">
          <option>This Year</option>
          <option>Last Year</option>
        </select>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div>
          <p className="text-xs text-white/50 mb-1">Total Income</p>
          <p className="stat-font text-2xl font-bold text-white">₹{totalIncome > 0 ? totalIncome.toLocaleString() : '84,500'}</p>
        </div>
        <div>
          <p className="text-xs text-white/50 mb-1">Total Expenses</p>
          <p className="stat-font text-2xl font-bold text-white">₹{totalExpense > 0 ? totalExpense.toLocaleString() : '32,400'}</p>
        </div>
        <div>
          <p className="text-xs text-white/50 mb-1">Net Profit</p>
          <p className="stat-font text-2xl font-bold text-emerald-400">
            ₹{profit !== 0 ? profit.toLocaleString() : '52,100'}
            <span className="text-xs ml-2 bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">+{profit !== 0 ? profitMargin : '61'}%</span>
          </p>
        </div>
      </div>
      
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={financeData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis dataKey="name" stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#ffffff40" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000000dd', borderColor: '#ffffff20', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Area type="monotone" dataKey="income" stroke="#34d399" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
            <Area type="monotone" dataKey="expense" stroke="#f87171" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function DiseaseAnalyticsWidget() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 lg:col-span-1 backdrop-blur">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
        <Activity size={16} className="text-blush-400" />
        Disease Analytics
      </div>
      
      <div className="flex flex-col gap-6 flex-1">
        <div className="flex items-center h-[140px]">
          <div className="h-full w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={diseaseData} cx="50%" cy="50%" innerRadius={35} outerRadius={55} paddingAngle={5} dataKey="value" stroke="none">
                  {diseaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#000000dd', borderColor: '#ffffff20', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 flex flex-col gap-3 justify-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-sm text-white/70">Healthy</span></div>
              <span className="font-bold">72%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-400" /><span className="text-sm text-white/70">Diseased</span></div>
              <span className="font-bold">28%</span>
            </div>
          </div>
        </div>

        <div className="mt-auto border-t border-white/10 pt-4">
          <p className="text-xs text-white/50 mb-2">Monthly Detection Trend</p>
          <div className="h-[60px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={diseaseTrendData}>
                <Line type="monotone" dataKey="cases" stroke="#f87171" strokeWidth={3} dot={{ r: 4, fill: '#f87171' }} />
                <Tooltip contentStyle={{ backgroundColor: '#000000dd', borderColor: '#ffffff20', borderRadius: '8px' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
