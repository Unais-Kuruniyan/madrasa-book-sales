'use client'

import { useEffect, useState } from 'react'
import { createPayment, deletePayment, getPaymentsByTeacher, getTeacherFinancialSummary, updatePayment } from '@/lib/actions/payment'
import { createExpense, deleteExpense, getAccountingSummary, getExpenses, updateExpense } from '@/lib/actions/expense'
import {
  CheckCircle2,
  Coins,
  HandCoins,
  History,
  Landmark,
  Pencil,
  Receipt,
  Trash2,
  TrendingUp,
  User,
  Wallet,
  X,
} from 'lucide-react'

type TeacherSummary = {
  totalOrdered: number
  totalPaid: number
  dueAmount: number
}

type PaymentItem = {
  id: string
  amount: number
  date: Date | string
}

type ExpenseItem = {
  id: string
  title: string
  amount: number
  notes: string | null
  date: Date | string
}

type AccountingSummary = {
  totalOrderedAmount: number
  totalCollectedAmount: number
  totalExpensesAmount: number
  outstandingAmount: number
  netProfitAmount: number
}

const formatDate = (date: string | Date) => {
  const d = new Date(date)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export default function PaymentManager({ teachers }: { teachers: any[] }) {
  const [teacherId, setTeacherId] = useState('')
  const [summary, setSummary] = useState<TeacherSummary | null>(null)
  const [payments, setPayments] = useState<PaymentItem[]>([])

  const [amount, setAmount] = useState('')
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null)

  const [accountingSummary, setAccountingSummary] = useState<AccountingSummary | null>(null)
  const [expenses, setExpenses] = useState<ExpenseItem[]>([])

  const [expenseTitle, setExpenseTitle] = useState('')
  const [expenseAmount, setExpenseAmount] = useState('')
  const [expenseNotes, setExpenseNotes] = useState('')
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)

  const loadTeacherData = async (selectedTeacherId: string) => {
    if (!selectedTeacherId) {
      setSummary(null)
      setPayments([])
      return
    }

    const [teacherSummary, teacherPayments] = await Promise.all([
      getTeacherFinancialSummary(selectedTeacherId),
      getPaymentsByTeacher(selectedTeacherId),
    ])

    setSummary(teacherSummary)
    setPayments(teacherPayments)
  }

  const loadAccountingData = async () => {
    const [globalSummary, allExpenses] = await Promise.all([getAccountingSummary(), getExpenses()])
    setAccountingSummary(globalSummary)
    setExpenses(allExpenses)
  }

  useEffect(() => {
    let active = true

    const fetchAccounting = async () => {
      const [globalSummary, allExpenses] = await Promise.all([getAccountingSummary(), getExpenses()])
      if (!active) return
      setAccountingSummary(globalSummary)
      setExpenses(allExpenses)
    }

    void fetchAccounting()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (!teacherId) return

    let active = true

    const fetchTeacher = async () => {
      const [teacherSummary, teacherPayments] = await Promise.all([
        getTeacherFinancialSummary(teacherId),
        getPaymentsByTeacher(teacherId),
      ])
      if (!active) return
      setSummary(teacherSummary)
      setPayments(teacherPayments)
    }

    void fetchTeacher()

    return () => {
      active = false
    }
  }, [teacherId])

  const handleAddOrUpdatePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0 || !teacherId) return

    if (editingPaymentId) {
      await updatePayment(editingPaymentId, { amount: parseFloat(amount) })
      setEditingPaymentId(null)
    } else {
      await createPayment({ teacherId, amount: parseFloat(amount) })
    }

    setAmount('')
    await Promise.all([loadTeacherData(teacherId), loadAccountingData()])
    alert(editingPaymentId ? 'Payment updated.' : 'Payment recorded.')
  }

  const startEditPayment = (payment: PaymentItem) => {
    setEditingPaymentId(payment.id)
    setAmount(payment.amount.toString())
  }

  const handleDeletePayment = async (id: string) => {
    if (!confirm('Delete this payment record?')) return

    await deletePayment(id)
    await Promise.all([loadTeacherData(teacherId), loadAccountingData()])
  }

  const handleAddOrUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!expenseTitle.trim() || !expenseAmount || parseFloat(expenseAmount) <= 0) return

    const payload = {
      title: expenseTitle,
      amount: parseFloat(expenseAmount),
      notes: expenseNotes,
    }

    if (editingExpenseId) {
      await updateExpense(editingExpenseId, payload)
      setEditingExpenseId(null)
    } else {
      await createExpense(payload)
    }

    setExpenseTitle('')
    setExpenseAmount('')
    setExpenseNotes('')
    await loadAccountingData()
    alert(editingExpenseId ? 'Expense updated.' : 'Expense added.')
  }

  const startEditExpense = (expense: ExpenseItem) => {
    setEditingExpenseId(expense.id)
    setExpenseTitle(expense.title)
    setExpenseAmount(expense.amount.toString())
    setExpenseNotes(expense.notes || '')
  }

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Delete this expense?')) return

    await deleteExpense(id)
    await loadAccountingData()
  }

  return (
    <div className="flex flex-col gap-8">
      <div id="accounting-overview" className="card bg-primary/5 border-primary/20">
        <h3 className="text-lg font-bold mb-6">Accounting Overview</h3>

        {accountingSummary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card border-border/50 bg-secondary/20">
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Total Orders</p>
              <p className="text-xl font-black">Rs. {accountingSummary.totalOrderedAmount.toLocaleString()}</p>
            </div>
            <div className="card border-success/20 bg-success/5">
              <p className="text-[10px] font-bold text-success uppercase tracking-widest mb-2">Collected</p>
              <p className="text-xl font-black text-success">Rs. {accountingSummary.totalCollectedAmount.toLocaleString()}</p>
            </div>
            <div className="card border-warning/20 bg-warning/5">
              <p className="text-[10px] font-bold text-warning uppercase tracking-widest mb-2">Expenses</p>
              <p className="text-xl font-black text-warning">Rs. {accountingSummary.totalExpensesAmount.toLocaleString()}</p>
            </div>
            <div className={`card ${accountingSummary.netProfitAmount >= 0 ? 'border-success/20 bg-success/5' : 'border-destructive/20 bg-destructive/5'}`}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2">Net Profit</p>
              <p className={`text-xl font-black ${accountingSummary.netProfitAmount >= 0 ? 'text-success' : 'text-destructive'}`}>
                Rs. {accountingSummary.netProfitAmount.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card bg-secondary/10 border-border/40">
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Wallet className="text-warning" size={20} />
            <span>{editingExpenseId ? 'Update Expense' : 'Add Expense'}</span>
          </h4>

          <form onSubmit={handleAddOrUpdateExpense} className="flex flex-col gap-4">
            <input
              className="input-field"
              placeholder="Expense title"
              value={expenseTitle}
              onChange={(e) => setExpenseTitle(e.target.value)}
              required
            />
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-warning">Rs</span>
              <input
                className="input-field pl-10"
                type="number"
                placeholder="0.00"
                value={expenseAmount}
                onChange={(e) => setExpenseAmount(e.target.value)}
                step="0.01"
                required
              />
            </div>
            <textarea
              className="input-field"
              placeholder="Notes (optional)"
              value={expenseNotes}
              onChange={(e) => setExpenseNotes(e.target.value)}
              rows={3}
            />

            <div className="flex flex-wrap gap-2">
              <button type="submit" className="btn btn-primary flex-1 h-12">
                {editingExpenseId ? <CheckCircle2 size={18} /> : <Coins size={18} />}
                <span>{editingExpenseId ? 'Update Expense' : 'Save Expense'}</span>
              </button>
              {editingExpenseId && (
                <button
                  type="button"
                  className="btn btn-secondary h-12 px-4"
                  onClick={() => {
                    setEditingExpenseId(null)
                    setExpenseTitle('')
                    setExpenseAmount('')
                    setExpenseNotes('')
                  }}
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="card">
          <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
            <History className="text-primary" size={20} />
            <span>Expense Ledger</span>
          </h4>

          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1 no-scrollbar">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-start p-4 rounded-xl bg-secondary/30 border border-border/50 group">
                <div className="flex flex-col gap-1 min-w-0 flex-1 mr-4">
                  <span className="font-bold text-sm truncate">{expense.title}</span>
                  <span className="text-xs text-muted-foreground/60">{formatDate(expense.date)}</span>
                  {expense.notes && <span className="text-xs text-muted italic">{expense.notes}</span>}
                </div>
                <div className="record-actions">
                  <span className="text-sm font-black text-warning whitespace-nowrap">Rs. {expense.amount.toLocaleString()}</span>
                  <button className="action-btn action-btn-edit" title="Edit Expense" onClick={() => startEditExpense(expense)}>
                    <Pencil size={16} />
                  </button>
                  <button className="action-btn action-btn-delete" title="Delete Expense" onClick={() => handleDeleteExpense(expense.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {expenses.length === 0 && (
              <div className="py-12 text-center border border-dashed border-border rounded-xl">
                <p className="text-muted italic">No expenses added yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card bg-primary/5 border-primary/20">
        <h3 className="text-lg font-bold mb-6">Teacher Ledger</h3>

        <label className="text-xs font-bold text-muted uppercase tracking-widest mb-2 block px-1">Select Faculty Member</label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-primary">
            <User size={18} />
          </div>
          <select
            className="input-field pl-10 h-12 text-lg font-medium"
            value={teacherId}
            onChange={(e) => {
              const nextTeacherId = e.target.value
              setTeacherId(nextTeacherId)
              if (!nextTeacherId) {
                setSummary(null)
                setPayments([])
              }
            }}
          >
            <option value="">Choose a teacher...</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>

        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="card border-border/50 bg-secondary/10">
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Total Liability</p>
              <p className="text-xl font-black">Rs. {summary.totalOrdered.toLocaleString()}</p>
            </div>
            <div className="card border-success/20 bg-success/5">
              <p className="text-[10px] font-bold text-success uppercase tracking-widest mb-2">Total Remitted</p>
              <p className="text-xl font-black text-success">Rs. {summary.totalPaid.toLocaleString()}</p>
            </div>
            <div className="card border-destructive/20 bg-destructive/5">
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mb-2">Outstanding Balance</p>
              <p className="text-xl font-black text-destructive">Rs. {summary.dueAmount.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {teacherId && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card bg-secondary/10 border-border/40">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Landmark className="text-primary" size={20} />
              <span>{editingPaymentId ? 'Update Payment' : 'Record Payment'}</span>
            </h4>
            <form onSubmit={handleAddOrUpdatePayment} className="flex flex-col gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-black text-primary">Rs</span>
                <input
                  className="input-field pl-10 h-14 text-xl font-bold"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary flex-1 h-12 shadow-lg shadow-primary/20">
                  {editingPaymentId ? <CheckCircle2 size={18} /> : <HandCoins size={18} />}
                  <span>{editingPaymentId ? 'Apply Update' : 'Post Payment'}</span>
                </button>
                {editingPaymentId && (
                  <button
                    type="button"
                    className="btn btn-secondary h-12 px-4"
                    onClick={() => {
                      setEditingPaymentId(null)
                      setAmount('')
                    }}
                  >
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
              {payments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-4 rounded-xl bg-secondary/40 border border-border/50 group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-success/10 rounded-lg text-success">
                      <Receipt size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground/60 font-black tracking-widest uppercase">{formatDate(payment.date)}</span>
                      <span className="text-xl font-black text-white group-hover:text-success transition-colors">Rs. {payment.amount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="record-actions">
                    <button className="action-btn action-btn-edit" title="Edit Payment" onClick={() => startEditPayment(payment)}>
                      <Pencil size={18} />
                    </button>
                    <button className="action-btn action-btn-delete" title="Delete Payment" onClick={() => handleDeletePayment(payment.id)}>
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

      {accountingSummary && (
        <div className="card bg-secondary/10 border-border/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp size={16} />
            <span>Outstanding Receivables</span>
          </div>
          <span className={`text-lg font-black ${accountingSummary.outstandingAmount > 0 ? 'text-warning' : 'text-success'}`}>
            Rs. {accountingSummary.outstandingAmount.toLocaleString()}
          </span>
        </div>
      )}
    </div>
  )
}
