'use client'

import { useState, useEffect } from 'react'
import { createOrder, OrderItemInput } from '@/lib/actions/order'
import { ShoppingCart, Plus, Trash2, Layers, BookOpen, Percent, Calculator, User, GraduationCap, CheckCircle2, PlusCircle } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function OrderForm({ teachers, classes }: { teachers: any[], classes: any[] }) {
  const [teacherId, setTeacherId] = useState('')
  const [classId, setClassId] = useState('')
  
  const [items, setItems] = useState<OrderItemInput[]>([])
  
  const selectedTeacher = teachers.find(t => t.id === teacherId)
  const availableClasses = selectedTeacher ? selectedTeacher.classes : []
  const selectedClass = classes.find(c => c.id === parseInt(classId))

  const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const commission = total * 0.15
  const net = total - commission

  const addItem = (type: 'SET' | 'BOOK', id: string, name: string, price: number) => {
    const existing = items.find(i => (type === 'SET' ? i.bookSetId === id : i.bookId === id))
    if (existing) {
      setItems(items.map(i => (type === 'SET' ? i.bookSetId === id : i.bookId === id) ? { ...i, quantity: i.quantity + 1 } : i))
    } else {
      setItems([...items, { 
        type, 
        bookId: type === 'BOOK' ? id : undefined, 
        bookSetId: type === 'SET' ? id : undefined, 
        quantity: 1, 
        price 
      }])
    }
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teacherId || !classId || items.length === 0) return alert('Please fill all fields')
    
    await createOrder({
      teacherId,
      classId: parseInt(classId),
      items
    })
    alert('Order created!')
    window.location.reload()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted uppercase tracking-widest px-1">Assign to Teacher</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" size={18} />
            <select className="input-field pl-10 h-12" value={teacherId} onChange={e => { setTeacherId(e.target.value); setClassId(''); setItems([]); }} required>
              <option value="">Select Faculty...</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-muted uppercase tracking-widest px-1">Academic Class</label>
          <div className="relative">
            <GraduationCap className={cn("absolute left-3 top-1/2 -translate-y-1/2", teacherId ? "text-primary" : "text-muted-foreground")} size={18} />
            <select className="input-field pl-10 h-12" value={classId} onChange={e => { setClassId(e.target.value); setItems([]); }} required disabled={!teacherId}>
              <option value="">Select Level...</option>
              {availableClasses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {selectedClass && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6 border-t border-border">
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted flex items-center gap-2">
              <Layers size={16} />
              <span>Inventory Selection</span>
            </h4>
            
            <div className="space-y-4">
              {selectedClass.bookSets.map((s: any) => (
                <button key={s.id} type="button" className="btn btn-secondary w-full justify-between h-14 border-primary/20 bg-primary/5 hover:bg-primary/10 group" onClick={() => addItem('SET', s.id, 'Full Set', s.price)}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-lg text-primary">
                      <Layers size={18} />
                    </div>
                    <span className="font-bold tracking-tight">Full Textbook Set</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-primary">₹{s.price}</span>
                    <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus size={16} className="text-primary" />
                    </div>
                  </div>
                </button>
              ))}

              <div className="grid grid-cols-1 gap-2">
                {selectedClass.books.map((b: any) => (
                  <button key={b.id} type="button" className="btn btn-secondary w-full justify-between h-12 hover:border-primary/30 group" onClick={() => addItem('BOOK', b.id, b.name, b.price)}>
                    <div className="flex items-center gap-3">
                      <BookOpen size={16} className="text-muted" />
                      <span className="text-sm font-medium">{b.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground">₹{b.price}</span>
                      <Plus size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted flex items-center gap-2">
              <ShoppingCart size={16} />
              <span>Cart Summary</span>
            </h4>
            
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-secondary/30 rounded-xl border border-border/50 animate-in fade-in slide-in-from-right-2 duration-300">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{item.type === 'SET' ? 'Full Set' : selectedClass.books.find((b: any) => b.id === item.bookId)?.name}</span>
                    <span className="text-xs text-muted font-medium">Quantity: {item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-black text-foreground">₹{(item.quantity * item.price).toLocaleString()}</span>
                    <button type="button" className="p-1.5 hover:bg-destructive/10 rounded-lg text-muted hover:text-destructive transition-colors" onClick={() => removeItem(index)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-muted bg-secondary/20 rounded-xl border border-dashed border-border">
                  <ShoppingCart size={32} className="mb-2 opacity-20" />
                  <p className="text-xs italic">Cart is currently empty</p>
                </div>
              )}
            </div>

            <div className="mt-auto bg-card p-6 rounded-2xl border border-border shadow-inner space-y-4">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-muted-foreground flex items-center gap-2 italic">
                  <Calculator size={14} />
                  Gross Total
                </span>
                <span className="font-bold">₹{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-warning flex items-center gap-2 italic">
                  <Percent size={14} />
                  IEB Commission (15%)
                </span>
                <span className="font-bold text-warning">- ₹{commission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <span className="text-lg font-black uppercase tracking-tighter text-primary">Net Payable</span>
                <span className="text-2xl font-black text-primary">₹{net.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <button type="submit" className="btn btn-primary w-full h-14 text-lg font-black shadow-xl shadow-primary/30 uppercase tracking-widest mt-4" disabled={items.length === 0}>
        <CheckCircle2 size={24} />
        <span>Confirm & Generate Order</span>
      </button>
    </form>
  )
}
