'use client'

import { updateOrderStatus, deleteOrder } from '@/lib/actions/order'
import { PackageCheck, Trash2, Printer, Clock, CheckCircle2, ShoppingCart, GraduationCap, User } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function OrderList({ orders }: { orders: any[] }) {
  const handleMarkDistributed = async (id: string) => {
    if (confirm('Mark as distributed?')) {
      await updateOrderStatus(id, 'DISTRIBUTED', new Date())
      window.location.reload()
    }
  }

  const handleDeleteOrder = async (id: string) => {
    if (confirm('Delete this order and all its items?')) {
      await deleteOrder(id)
      window.location.reload()
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {orders.map(o => (
        <div key={o.id} className="card flex flex-col group hover:border-primary/50 transition-all">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <User size={14} className="text-primary" />
                <p className="font-bold text-lg">{o.teacher.name}</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted font-medium uppercase tracking-wider">
                <GraduationCap size={12} />
                <span>{o.class.name}</span>
                <span className="mx-1">•</span>
                <Clock size={12} />
                <span>{new Date(o.date).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="text-right flex flex-col items-end gap-2">
              <span className={cn(
                "inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-tighter",
                o.status === 'PENDING' ? "bg-warning/20 text-warning border border-warning/20" : "bg-success/20 text-success border border-success/20"
              )}>
                {o.status === 'PENDING' ? <Clock size={10} /> : <CheckCircle2 size={10} />}
                {o.status}
              </span>
              <p className="text-xl font-black text-primary">₹{o.totalAmount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex-1 space-y-3 mb-6 bg-secondary/20 p-4 rounded-xl border border-border/50">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/30">
              <ShoppingCart size={14} className="text-muted" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order Items</span>
            </div>
            {o.items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground/90">{item.type === 'SET' ? 'Full Textbook Set' : item.book.name}</span>
                  <span className="text-xs text-muted">Qty: {item.quantity} × ₹{item.price}</span>
                </div>
                <span className="font-bold text-foreground">₹{(item.quantity * item.price).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-border">
            {o.status === 'PENDING' && (
              <button 
                className="btn btn-secondary text-xs bg-success/10 text-success border border-success/20 hover:bg-success/20 h-10 px-4" 
                onClick={() => handleMarkDistributed(o.id)}
              >
                <PackageCheck size={16} />
                <span>Mark Delivered</span>
              </button>
            )}
            <button 
              className="btn btn-secondary h-10 w-10 p-0 text-muted hover:text-foreground" 
              title="Print Order Summary"
            >
              <Printer size={18} />
            </button>
            <button 
              className="btn btn-secondary h-10 w-10 p-0 text-muted hover:text-destructive group-hover:bg-destructive/10 group-hover:border-destructive/20" 
              onClick={() => handleDeleteOrder(o.id)}
              title="Delete Order"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
      {orders.length === 0 && (
        <div className="col-span-full card py-16 text-center border-dashed border-2">
          <div className="inline-flex p-4 bg-muted/20 rounded-full mb-4">
            <ShoppingCart size={48} className="text-muted" />
          </div>
          <p className="text-xl font-bold mb-1">No orders placed yet</p>
          <p className="text-muted text-sm">Create your first order from the dashboard or orders page.</p>
        </div>
      )}
    </div>
  )
}
