'use server'

import prisma from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getTeachers() {
  return await prisma.teacher.findMany({
    include: {
      classes: true,
      orders: true,
      payments: true,
    },
    orderBy: { name: 'asc' },
  })
}

export async function createTeacher(data: { name: string; contact?: string; classIds: number[] }) {
  const teacher = await prisma.teacher.create({
    data: {
      name: data.name,
      contact: data.contact,
      classes: {
        connect: data.classIds.map((id) => ({ id })),
      },
    },
  })
  revalidatePath('/teachers')
  return teacher
}

export async function updateTeacher(id: string, data: { name: string; contact?: string; classIds: number[] }) {
  const teacher = await prisma.teacher.update({
    where: { id },
    data: {
      name: data.name,
      contact: data.contact,
      classes: {
        set: data.classIds.map((id) => ({ id })),
      },
    },
  })
  revalidatePath('/teachers')
  return teacher
}

export async function deleteTeacher(id: string) {
  await prisma.teacher.delete({ where: { id } })
  revalidatePath('/teachers')
}
