'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getPaymentsByTeacher(teacherId: string) {
  return await prisma.payment.findMany({
    where: { teacherId },
    orderBy: { date: 'desc' },
  })
}

export async function createPayment(data: { teacherId: string; amount: number; date?: Date }) {
  const payment = await prisma.payment.create({
    data: {
      teacherId: data.teacherId,
      amount: data.amount,
      date: data.date || new Date(),
    },
  })
  revalidatePath('/payments')
  revalidatePath('/')
  return payment
}

export async function getTeacherFinancialSummary(teacherId: string) {
  const orders = await prisma.order.findMany({
    where: { teacherId },
    select: { totalAmount: true },
  })
  const payments = await prisma.payment.findMany({
    where: { teacherId },
    select: { amount: true },
  })

  const totalOrdered = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
  const dueAmount = totalOrdered - totalPaid

  return {
    totalOrdered,
    totalPaid,
    dueAmount,
  }
}

export async function deletePayment(id: string) {
  await prisma.payment.delete({ where: { id } })
  revalidatePath('/payments')
  revalidatePath('/')
}

export async function updatePayment(id: string, data: { amount: number; date?: Date }) {
  const result = await prisma.payment.update({
    where: { id },
    data: {
      amount: data.amount,
      date: data.date,
    },
  })
  revalidatePath('/payments')
  revalidatePath('/')
  return result
}
