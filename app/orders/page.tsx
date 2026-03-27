import { getTeachers } from '@/lib/actions/teacher'
import { getClasses } from '@/lib/actions/class'
import { getOrders } from '@/lib/actions/order'
import OrderForm from '@/components/OrderForm'
import OrderList from '@/components/OrderList'
import { ShoppingBag, History, Plus } from 'lucide-react'

export default async function OrdersPage() {
  const teachers = await getTeachers()
  const classes = await getClasses()
  const orders = await getOrders()

  return (
    <div className="container">
      <header className="mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <ShoppingBag size={24} />
          </div>
          <h1 className="text-3xl font-bold">Orders & Procurement</h1>
        </div>
        <p className="text-muted mt-2">Generate new textbook orders and track delivery status for faculty.</p>
      </header>

      <div className="grid gap-16">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-primary rounded-full"></div>
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <Plus size={20} className="text-primary" />
              New Procurement Order
            </h2>
          </div>
          <div className="card border-primary/10 shadow-xl shadow-primary/5">
            <OrderForm teachers={teachers} classes={classes} />
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-1 bg-secondary-foreground/20 rounded-full"></div>
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              <History size={20} className="text-muted-foreground" />
              Order History & Distribution
            </h2>
          </div>
          <OrderList orders={orders} />
        </section>
      </div>
    </div>
  )
}
