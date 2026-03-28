'use client'

import { updateOrderStatus, deleteOrder } from '@/lib/actions/order'
import { Trash2, Printer, Clock, CheckCircle2, ShoppingCart, GraduationCap, User, Pencil } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export default function OrderList({ orders }: { orders: any[] }) {
  const handleEditStatus = async (id: string, currentStatus: string) => {
    const isPending = currentStatus === 'PENDING'
    const nextStatus = isPending ? 'DISTRIBUTED' : 'PENDING'
    const confirmText = isPending ? 'Set this order as delivered?' : 'Move this order back to pending?'

    if (confirm(confirmText)) {
      await updateOrderStatus(id, nextStatus, isPending ? new Date() : null)
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
                <span>{formatDate(o.date)}</span>
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
            <button
              className="btn btn-secondary text-xs border border-primary/20 text-primary hover:bg-primary/10 h-10 px-4"
              onClick={() => handleEditStatus(o.id, o.status)}
            >
              <Pencil size={16} />
              <span>{o.status === 'PENDING' ? 'Set Delivered' : 'Set Pending'}</span>
            </button>
            <button 
              className="action-btn" 
              title="Print Order Summary"
            >
              <Printer size={18} />
            </button>
            <button 
              className="action-btn action-btn-delete"
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
