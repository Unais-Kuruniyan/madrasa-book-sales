import { getDepotPurchaseSummary } from '@/lib/actions/report'
import { ClipboardList, Printer, Layers, BookOpen, Package2, AlertCircle } from 'lucide-react'

export default async function DepotSummaryPage() {
  const summary = await getDepotPurchaseSummary()

  return (
    <div className="container overflow-hidden">
      <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <ClipboardList size={24} />
            </div>
            <h1 className="text-3xl font-bold font-display tracking-tight">Depot Procurement</h1>
          </div>
          <p className="text-muted mt-2">Aggregated purchase list for official IEB textbook procurement.</p>
        </div>
        <button className="btn btn-primary h-12 px-6 shadow-lg shadow-primary/20 flex items-center gap-2">
          <Printer size={20} />
          <span>Export Summary</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Object.entries(summary).map(([className, data]: [string, any]) => (
          <div key={className} className="card relative group hover:border-primary/50 transition-all flex flex-col">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
              <div className="p-2 bg-secondary rounded-lg">
                <Layers size={18} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">{className}</h3>
            </div>
            
            <div className="space-y-6 flex-1">
              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex justify-between items-center h-20">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Full Textbook Sets</span>
                  <span className="text-sm font-semibold opacity-80">Bulk Order Quantity</span>
                </div>
                <span className="text-4xl font-black text-primary leading-none">{data.fullSets}</span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={14} className="text-muted" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Individual Supplements</p>
                </div>
                {Object.keys(data.individualBooks).length > 0 ? (
                  <div className="space-y-2">
                    {Object.entries(data.individualBooks).map(([book, qty]: [string, any]) => (
                      <div key={book} className="flex justify-between items-center p-3 rounded-lg bg-secondary/50 border border-border/30 hover:bg-secondary/80 transition-colors">
                        <span className="text-sm font-medium">{book}</span>
                        <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                          {qty}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 text-muted/50 border border-dashed border-border rounded-lg justify-center">
                    <span className="text-xs italic">No supplements required</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted font-medium italic">
              <div className="flex items-center gap-1">
                <Package2 size={12} />
                <span>Ready for procurement</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(summary).length === 0 && (
        <div className="card flex flex-col items-center justify-center py-24 text-center border-dashed border-2 bg-secondary/10">
          <div className="p-6 bg-muted/10 rounded-full mb-6 text-muted">
            <AlertCircle size={64} strokeWidth={1} />
          </div>
          <p className="text-xl font-bold mb-2">Inventory Data Empty</p>
          <p className="text-muted text-sm max-w-md">No pending orders were found in the system. Create a teacher order to automatically generate a procurement summary here.</p>
        </div>
      )}
    </div>
  )
}
