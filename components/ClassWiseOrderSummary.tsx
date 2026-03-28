'use client'

import { useMemo, useState } from 'react'
import { BookOpen, Layers, ListFilter, PackageSearch } from 'lucide-react'
import type { ClassWiseOrderSummary as ClassWiseOrderSummaryItem } from '@/lib/actions/order'

const ALL_CLASSES = 'ALL'

function formatCurrency(amount: number) {
  return `Rs. ${amount.toLocaleString()}`
}

export default function ClassWiseOrderSummary({ summaries }: { summaries: ClassWiseOrderSummaryItem[] }) {
  const [selectedClass, setSelectedClass] = useState<string>(ALL_CLASSES)

  const visibleSummaries = useMemo(() => {
    if (selectedClass === ALL_CLASSES) return summaries
    return summaries.filter((entry) => String(entry.classId) === selectedClass)
  }, [selectedClass, summaries])

  return (
    <div className="card border-primary/20 bg-primary/5">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <PackageSearch size={18} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Class-Wise Aggregate Orders</h3>
            <p className="text-xs text-muted">View total sets and book quantities grouped by class.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <ListFilter size={16} className="text-muted" />
          <select
            className="input-field h-11"
            value={selectedClass}
            onChange={(event) => setSelectedClass(event.target.value)}
          >
            <option value={ALL_CLASSES}>All Classes</option>
            {summaries.map((entry) => (
              <option key={entry.classId} value={String(entry.classId)}>
                {entry.className}
              </option>
            ))}
          </select>
        </div>
      </div>

      {summaries.length === 0 && (
        <div className="py-12 text-center border border-dashed border-border rounded-xl">
          <p className="font-semibold mb-1">No orders available yet.</p>
          <p className="text-sm text-muted">Create orders to generate class-wise aggregate totals.</p>
        </div>
      )}

      {summaries.length > 0 && visibleSummaries.length === 0 && (
        <div className="py-12 text-center border border-dashed border-border rounded-xl">
          <p className="font-semibold mb-1">No data for selected class.</p>
          <p className="text-sm text-muted">Try switching to another class or select All Classes.</p>
        </div>
      )}

      {visibleSummaries.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visibleSummaries.map((entry) => (
            <article key={entry.classId} className="card bg-secondary/20 border-border/50 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-4 pb-3 border-b border-border/40">
                <h4 className="text-lg font-black tracking-tight">{entry.className}</h4>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {entry.totalOrders} Orders
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Full Sets</p>
                  <p className="text-xl font-black text-primary">{entry.fullSets}</p>
                </div>
                <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted mb-1">Order Value</p>
                  <p className="text-base font-black text-success">{formatCurrency(entry.totalAmount)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-muted mb-3">
                <BookOpen size={14} />
                <span>Book Breakdown</span>
              </div>

              <div className="flex flex-col gap-2 no-scrollbar" style={{ maxHeight: '15rem', overflowY: 'auto' }}>
                {entry.items.length > 0 ? (
                  entry.items.map((item) => (
                    <div key={`${entry.classId}-${item.name}`} className="flex items-center justify-between gap-3 p-3 rounded-lg bg-background/50 border border-border/50">
                      <span className="text-sm font-semibold min-w-0 truncate">{item.name}</span>
                      <span className="inline-flex items-center justify-center h-7 min-w-7 px-2 rounded-full bg-warning/10 border border-warning/20 text-warning text-xs font-black">
                        {item.quantity}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-lg border border-dashed border-border text-sm text-muted italic">
                    No individual books in orders for this class.
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-border/40 text-xs text-muted flex items-center gap-2">
                <Layers size={12} />
                <span>Aggregated from all recorded orders for this class.</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
