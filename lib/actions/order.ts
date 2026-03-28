'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export type OrderItemInput = {
  type: 'SET' | 'BOOK'
  bookId?: string
  bookSetId?: string
  quantity: number
  price: number
}

export type ClassWiseOrderSummary = {
  classId: number
  className: string
  totalOrders: number
  totalAmount: number
  fullSets: number
  items: Array<{
    name: string
    quantity: number
  }>
}

export async function createOrder(data: {
  teacherId: string
  classId: number
  items: OrderItemInput[]
}) {
  const totalAmount = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const netCost = totalAmount

  const order = await prisma.order.create({
    data: {
      teacherId: data.teacherId,
      classId: data.classId,
      totalAmount,
      commission: 0,
      netCost,
      status: 'PENDING',
      items: {
        create: data.items.map((item) => ({
          type: item.type,
          bookId: item.bookId,
          bookSetId: item.bookSetId,
          quantity: item.quantity,
          price: item.price,
        })),
      },
    },
  })

  revalidatePath('/orders')
  revalidatePath('/')
  return order
}

export async function getOrders() {
  return await prisma.order.findMany({
    include: {
      teacher: true,
      class: true,
      items: {
        include: {
          book: true,
          bookSet: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  })
}

export async function getClassWiseOrderSummary(): Promise<ClassWiseOrderSummary[]> {
  const orders = await prisma.order.findMany({
    include: {
      class: true,
      items: {
        include: {
          book: true,
        },
      },
    },
    orderBy: {
      classId: 'asc',
    },
  })

  const summaryMap = new Map<number, {
    classId: number
    className: string
    totalOrders: number
    totalAmount: number
    fullSets: number
    itemsMap: Map<string, number>
  }>()

  for (const order of orders) {
    const existing =
      summaryMap.get(order.classId) ??
      {
        classId: order.classId,
        className: order.class.name,
        totalOrders: 0,
        totalAmount: 0,
        fullSets: 0,
        itemsMap: new Map<string, number>(),
      }

    existing.totalOrders += 1
    existing.totalAmount += order.totalAmount

    for (const item of order.items) {
      if (item.type === 'SET') {
        existing.fullSets += item.quantity
        continue
      }

      if (item.book?.name) {
        const previousQty = existing.itemsMap.get(item.book.name) ?? 0
        existing.itemsMap.set(item.book.name, previousQty + item.quantity)
      }
    }

    summaryMap.set(order.classId, existing)
  }

  return Array.from(summaryMap.values())
    .sort((a, b) => a.classId - b.classId)
    .map((entry) => ({
      classId: entry.classId,
      className: entry.className,
      totalOrders: entry.totalOrders,
      totalAmount: entry.totalAmount,
      fullSets: entry.fullSets,
      items: Array.from(entry.itemsMap.entries())
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => (b.quantity - a.quantity) || a.name.localeCompare(b.name)),
    }))
}

export async function updateOrderStatus(id: string, status: string, deliveredDate?: Date | null) {
  const order = await prisma.order.update({
    where: { id },
    data: {
      status,
      deliveredDate,
    },
  })
  revalidatePath('/orders')
  return order
}

export async function deleteOrder(id: string) {
  // First delete order items
  await prisma.orderItem.deleteMany({ where: { orderId: id } })
  await prisma.order.delete({ where: { id } })
  revalidatePath('/orders')
  revalidatePath('/')
}
