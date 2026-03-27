'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getExpenses() {
  return prisma.expense.findMany({
    orderBy: { date: 'desc' },
  })
}

export async function createExpense(data: { title: string; amount: number; notes?: string; date?: Date }) {
  const expense = await prisma.expense.create({
    data: {
      title: data.title.trim(),
      amount: data.amount,
      notes: data.notes?.trim() || null,
      date: data.date || new Date(),
    },
  })

  revalidatePath('/payments')
  revalidatePath('/')
  return expense
}

export async function updateExpense(id: string, data: { title: string; amount: number; notes?: string; date?: Date }) {
  const expense = await prisma.expense.update({
    where: { id },
    data: {
      title: data.title.trim(),
      amount: data.amount,
      notes: data.notes?.trim() || null,
      date: data.date,
    },
  })

  revalidatePath('/payments')
  revalidatePath('/')
  return expense
}

export async function deleteExpense(id: string) {
  await prisma.expense.delete({ where: { id } })
  revalidatePath('/payments')
  revalidatePath('/')
}

export async function getAccountingSummary() {
  const [orders, payments, expenses] = await prisma.$transaction([
    prisma.order.aggregate({
      _sum: { totalAmount: true },
    }),
    prisma.payment.aggregate({
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      _sum: { amount: true },
    }),
  ])

  const totalOrderedAmount = orders._sum.totalAmount ?? 0
  const totalCollectedAmount = payments._sum.amount ?? 0
  const totalExpensesAmount = expenses._sum.amount ?? 0
  const outstandingAmount = totalOrderedAmount - totalCollectedAmount
  const netProfitAmount = totalCollectedAmount - totalExpensesAmount

  return {
    totalOrderedAmount,
    totalCollectedAmount,
    totalExpensesAmount,
    outstandingAmount,
    netProfitAmount,
  }
}
