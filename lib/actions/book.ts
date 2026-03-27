'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getBooksByClass(classId: number) {
  return await prisma.book.findMany({
    where: { classId },
    orderBy: { name: 'asc' },
  })
}

export async function getBookSetsByClass(classId: number) {
  return await prisma.bookSet.findMany({
    where: { classId },
  })
}

export async function createBook(data: { name: string; price: number; classId: number }) {
  const book = await prisma.book.create({
    data: {
      name: data.name,
      price: data.price,
      classId: data.classId,
    },
  })
  revalidatePath('/books')
  return book
}

export async function updateBook(id: string, data: { name: string; price: number }) {
  const book = await prisma.book.update({
    where: { id },
    data: {
      name: data.name,
      price: data.price,
    },
  })
  revalidatePath('/books')
  return book
}

export async function createOrUpdateBookSet(classId: number, price: number) {
  const existing = await prisma.bookSet.findFirst({ where: { classId } })
  if (existing) {
    const result = await prisma.bookSet.update({
      where: { id: existing.id },
      data: { price },
    })
    revalidatePath('/books')
    return result
  } else {
    const result = await prisma.bookSet.create({
      data: { classId, price },
    })
    revalidatePath('/books')
    return result
  }
}

export async function deleteBook(id: string) {
  await prisma.book.delete({ where: { id } })
  revalidatePath('/books')
}
