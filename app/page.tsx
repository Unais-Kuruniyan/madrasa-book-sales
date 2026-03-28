import { getDashboardStats } from '@/lib/actions/report'
import { ShoppingBag, Landmark, Wallet, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function Dashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="container">
      <header className="mb-12">
        <h1 className="text-4xl font-black tracking-tighter mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">System Overview</h1>
        <p className="text-muted-foreground/80 font-medium">Real-time repository telemetry and distribution metrics.</p>
      </header>

      {/* Hero Section */}
      <div className="card mb-12 overflow-hidden relative border-primary/20 bg-gradient-to-br from-primary/10 to-transparent backdrop-blur-3xl" style={{ minHeight: '260px', display: 'flex', alignItems: 'center' }}>
        <div className="relative z-10 max-w-xl p-4">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-4 ring-1 ring-primary/30">Next-Gen Management</span>
          <h2 className="text-3xl font-black mb-4 tracking-tighter leading-none">Streamline Your <span className="text-primary text-glow">Madrasa Workflow</span></h2>
          <p className="text-muted-foreground font-medium mb-8 leading-relaxed max-w-sm">A centralized, high-performance ecosystem for tracking curriculum, orders, and financial data with surgical precision.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/orders#new-order" className="btn btn-primary shadow-2xl shadow-primary/40 px-8">
              Initialize Order
            </Link>
            <Link href="/payments#accounting-overview" className="btn btn-secondary border border-white/10 bg-white/5 backdrop-blur-sm">
              View Analytics
            </Link>
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-2/3 pointer-events-none">
          <img 
            src="/hero.png" 
            alt="Hero" 
            className="h-full w-full object-cover opacity-20 grayscale group-hover:grayscale-0 transition-all duration-700"
            style={{ maskImage: 'linear-gradient(to left, black, transparent, transparent)' }}
          />
          {/* Decorative Glow */}
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <ShoppingBag size={24} />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted mb-1">Total Orders</p>
            <p className="text-3xl font-bold">₹{stats.totalOrdersValue.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="card flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-success/10 rounded-lg text-success">
              <Landmark size={24} />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted mb-1">Total Collected</p>
            <p className="text-3xl font-bold text-success">₹{stats.totalCollectedAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="card flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-warning/10 rounded-lg text-warning">
              <Wallet size={24} />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-warning">₹{stats.totalExpensesAmount.toLocaleString()}</p>
          </div>
        </div>

        <div className="card flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg ${stats.netProfitAmount >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
              <TrendingUp size={24} />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted mb-1">Net Profit</p>
            <p className={`text-3xl font-bold ${stats.netProfitAmount >= 0 ? 'text-success' : 'text-destructive'}`}>
              ₹{stats.netProfitAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-primary" size={24} />
          <h2 className="text-xl font-bold">Recent Activity</h2>
        </div>
        <div className="card text-center py-12">
          <p className="text-muted italic">No recent activity to display.</p>
        </div>
      </div>
    </div>
  )
}
