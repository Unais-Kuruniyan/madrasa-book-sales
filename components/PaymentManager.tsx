'use client'

import { useState, useEffect } from 'react'
import { getTeacherFinancialSummary, getPaymentsByTeacher, createPayment, deletePayment, updatePayment } from '@/lib/actions/payment'
import { Wallet, History, PlusCircle, Receipt, Trash2, Pencil, Landmark, CheckCircle2, ChevronRight, User, X } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function PaymentManager({ teachers }: { teachers: any[] }) {
  const [teacherId, setTeacherId] = useState('')
  const [summary, setSummary] = useState<any>(null)
  const [payments, setPayments] = useState<any[]>([])
  
  const [amount, setAmount] = useState('')
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null)

  useEffect(() => {
    if (teacherId) {
      loadData()
    } else {
      setSummary(null)
      setPayments([])
    }
  }, [teacherId])

  const loadData = async () => {
    const s = await getTeacherFinancialSummary(teacherId)
    const p = await getPaymentsByTeacher(teacherId)
    setSummary(s)
    setPayments(p)
  }

  const handleAddOrUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return
    
    if (editingPaymentId) {
      await updatePayment(editingPaymentId, { amount: parseFloat(amount) })
      setEditingPaymentId(null)
    } else {
      await createPayment({ teacherId, amount: parseFloat(amount) })
    }
    setAmount('')
    loadData()
    alert(editingPaymentId ? 'Payment updated!' : 'Payment recorded!')
  }

  const startEditPayment = (p: any) => {
    setEditingPaymentId(p.id)
    setAmount(p.amount.toString())
  }

  const handleDeletePayment = async (id: string) => {
    if (confirm('Delete this payment record?')) {
      await deletePayment(id)
      loadData()
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="card bg-primary/5 border-primary/20">
        <label className="text-xs font-bold text-muted uppercase tracking-widest mb-2 block px-1">Select Faculty Member</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
            <User size={18} />
          </div>
          <select className="input-field pl-10 h-12 text-lg font-medium" value={teacherId} onChange={e => setTeacherId(e.target.value)}>
            <option value="">Choose a teacher...</option>
            {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
      </div>

      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="card flex flex-col justify-between border-border/50 bg-secondary/10">
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-4">Total Liability</p>
            <p className="text-2xl font-black">₹{summary.totalOrdered.toLocaleString()}</p>
          </div>
          <div className="card flex flex-col justify-between border-success/20 bg-success/5">
            <p className="text-[10px] font-bold text-success uppercase tracking-widest mb-4">Total Remitted</p>
            <p className="text-2xl font-black text-success">₹{summary.totalPaid.toLocaleString()}</p>
          </div>
          <div className="card flex flex-col justify-between border-destructive/20 bg-destructive/5">
            <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mb-4">Outstanding Balance</p>
            <p className="text-2xl font-black text-destructive">₹{summary.dueAmount.toLocaleString()}</p>
          </div>
        </div>
      )}

      {teacherId && (
        <div className="grid grid-cols-2 gap-8">
          <div className="card bg-secondary/10 border-border/40">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Landmark className="text-primary" size={20} />
              <span>{editingPaymentId ? 'Update Record' : 'Record Payment'}</span>
            </h4>
            <form onSubmit={handleAddOrUpdatePayment} className="flex flex-col gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-primary">₹</span>
                <input 
                  className="input-field pl-10 h-14 text-xl font-bold" 
                  type="number" 
                  placeholder="0.00" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)} 
                  required 
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1 h-12 shadow-lg shadow-primary/20">
                  {editingPaymentId ? <CheckCircle2 size={18} /> : <PlusCircle size={18} />}
                  <span>{editingPaymentId ? 'Apply Update' : 'Post Payment'}</span>
                </button>
                {editingPaymentId && (
                  <button type="button" className="btn btn-secondary h-12 px-4" onClick={() => { setEditingPaymentId(null); setAmount(''); }}>
                    <X size={18} />
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="card">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <History className="text-primary" size={20} />
              <span>Payment Ledger</span>
            </h4>
            <div className="space-y-3">
              {payments.map(p => (
                <div key={p.id} className="flex justify-between items-center p-4 rounded-xl bg-secondary/40 border border-border/50 group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-success/10 rounded-lg text-success">
                      <Receipt size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted font-bold tracking-tighter uppercase">{new Date(p.date).toLocaleDateString()}</span>
                      <span className="text-lg font-black text-foreground">₹{p.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" onClick={() => startEditPayment(p)}>
                      <Pencil size={18} />
                    </button>
                    <button className="p-2 text-muted hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors" onClick={() => handleDeletePayment(p.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {payments.length === 0 && (
                <div className="py-12 text-center border border-dashed border-border rounded-xl">
                  <p className="text-muted italic">No payment records found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
