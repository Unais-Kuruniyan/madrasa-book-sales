'use strict'

import prisma from '@/lib/db'

export async function getClasses() {
  return await prisma.class.findMany({
    include: {
      books: true,
      bookSets: true,
    },
    orderBy: { id: 'asc' },
  })
}
