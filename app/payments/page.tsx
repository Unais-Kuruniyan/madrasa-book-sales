import { getTeachers } from '@/lib/actions/teacher'
import PaymentManager from '@/components/PaymentManager'
import { Landmark } from 'lucide-react'

export default async function PaymentsPage() {
  const teachers = await getTeachers()

  return (
    <div className="container overflow-hidden">
      <header className="mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <Landmark size={24} />
          </div>
          <h1 className="text-3xl font-bold font-display">Financial Accounts</h1>
        </div>
        <p className="text-muted mt-2">Manage teacher ledgers, record payments, and track outstanding balances.</p>
      </header>

      <PaymentManager teachers={teachers} />
    </div>
  )
}
