'use server'

import prisma from '@/lib/db'

export async function getDepotPurchaseSummary() {
  // Aggregate items from all pending orders
  const items = await prisma.orderItem.findMany({
    where: {
      order: {
        status: 'PENDING',
      },
    },
    include: {
      order: {
        include: {
          class: true,
        },
      },
      book: true,
    },
  })

  // Group by class and item type/book
  const summary: Record<string, any> = {}

  items.forEach((item) => {
    const className = item.order.class.name
    if (!summary[className]) {
      summary[className] = {
        fullSets: 0,
        individualBooks: {},
      }
    }

    if (item.type === 'SET') {
      summary[className].fullSets += item.quantity
    } else if (item.book) {
      const bookName = item.book.name
      summary[className].individualBooks[bookName] = (summary[className].individualBooks[bookName] || 0) + item.quantity
    }
  })

  return summary
}

export async function getDashboardStats() {
  const orders = await prisma.order.findMany({
    select: { totalAmount: true, commission: true },
  })
  const payments = await prisma.payment.findMany({
    select: { amount: true },
  })

  const totalOrdersValue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalCommissionEarned = orders.reduce((sum, o) => sum + o.commission, 0)
  const totalCollectedAmount = payments.reduce((sum, p) => sum + p.amount, 0)
  const totalDueAmount = totalOrdersValue - totalCollectedAmount

  return {
    totalOrdersValue,
    totalCollectedAmount,
    totalDueAmount,
    totalCommissionEarned,
  }
}
