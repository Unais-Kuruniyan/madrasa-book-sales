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

export async function createOrder(data: {
  teacherId: string
  classId: number
  items: OrderItemInput[]
}) {
  const totalAmount = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const commission = totalAmount * 0.15
  const netCost = totalAmount - commission

  const order = await prisma.order.create({
    data: {
      teacherId: data.teacherId,
      classId: data.classId,
      totalAmount,
      commission,
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
  revalidatePath('/dashboard')
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

export async function updateOrderStatus(id: string, status: string, deliveredDate?: Date) {
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
  revalidatePath('/dashboard')
}
