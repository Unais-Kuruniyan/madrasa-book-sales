import { PrismaClient } from '@prisma/client'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  const data = [
    {
      id: 1,
      setPrice: 240,
      books: [
        { name: '1st THAFHEEM - I', price: 120 },
        { name: '1st THAFHEEM - II', price: 120 },
      ]
    },
    {
      id: 2,
      setPrice: 320,
      books: [
        { name: '2nd DUROOS - I', price: 65 },
        { name: '2nd DUROOS - II', price: 75 },
        { name: '2nd THAJVEED - I', price: 90 },
        { name: '2nd THAJVEED - II', price: 90 },
      ]
    },
    {
      id: 3,
      setPrice: 390,
      books: [
        { name: '3rd DUROOS - I', price: 100 },
        { name: '3rd DUROOS - II', price: 100 },
        { name: '3rd FIQH - I', price: 40 },
        { name: '3rd FIQH - II', price: 50 },
        { name: '3rd THAJVEED - I', price: 50 },
        { name: '3rd THAJVEED - II', price: 50 },
      ]
    },
    {
      id: 4,
      setPrice: 430,
      books: [
        { name: '4th DUROOS - I', price: 120 },
        { name: '4th DUROOS - II', price: 120 },
        { name: '4th FIQH - I', price: 50 },
        { name: '4th FIQH - II', price: 60 },
        { name: '4th THAJVEED - I', price: 40 },
        { name: '4th THAJVEED - II', price: 40 },
      ]
    },
    {
      id: 5,
      setPrice: 500,
      books: [
        { name: '5th DUROOS - I', price: 120 },
        { name: '5th DUROOS - II', price: 120 },
        { name: '5th FIQH - I', price: 70 },
        { name: '5th FIQH - II', price: 70 },
        { name: '5th THAJVEED - I', price: 60 },
        { name: '5th THAJVEED - II', price: 60 },
      ]
    },
    {
      id: 6,
      setPrice: 330,
      books: [
        { name: '6th FIQH', price: 75 },
        { name: '6th AQAID', price: 60 },
        { name: '6th THAZKIYA', price: 75 },
        { name: '6th THAREEKH', price: 60 },
        { name: '6th THAJVEED', price: 60 },
      ]
    },
    {
      id: 7,
      setPrice: 350,
      books: [
        { name: '7th FIQH', price: 80 },
        { name: '7th AQAID', price: 60 },
        { name: '7th THAZKIYA', price: 70 },
        { name: '7th THAREEKH', price: 70 },
        { name: '7th THAJVEED', price: 70 },
      ]
    },
    {
      id: 8,
      setPrice: 280,
      books: [
        { name: '8th DUROOS', price: 60 },
        { name: '8th DUROOS (Work)', price: 60 },
        { name: '8th FIQHUL ISLAM', price: 40 },
        { name: '8th FIQH (Work)', price: 40 },
        { name: '8th THAZKIYA', price: 40 },
        { name: '8th THAZKIYA (Work)', price: 40 },
      ]
    },
    {
      id: 9,
      setPrice: 300,
      books: [
        { name: '9th DUROOS', price: 55 },
        { name: '9th DUROOS (Work)', price: 55 },
        { name: '9th FIQHUL ISLAM', price: 50 },
        { name: '9th FIQH (Work)', price: 50 },
        { name: '9th THAZKIYA', price: 40 },
        { name: '9th THAZKIYA (Work)', price: 50 },
      ]
    },
    {
      id: 10,
      setPrice: 300,
      books: [
        { name: '10th DUROOS', price: 65 },
        { name: '10th DUROOS (Work)', price: 55 },
        { name: '10th FIQHUL ISLAM', price: 50 },
        { name: '10th FIQH (Work)', price: 50 },
        { name: '10th THAZKIYA', price: 40 },
        { name: '10th THAZKIYA (Work)', price: 40 },
      ]
    },
    {
      id: 11,
      name: 'QURA-AN',
      setPrice: 0,
      books: [
        { name: '2 JUZ QURA-AN', price: 40 },
        { name: '5 JUZ QURA-AN', price: 80 },
        { name: '30 JUZ QURA-AN', price: 245 },
      ]
    },
    {
      id: 12,
      name: 'OTHER',
      setPrice: 0,
      books: [
        { name: 'MADRASSA DAIRY', price: 25 },
      ]
    }
  ]

  for (const item of data) {
    // 1. Ensure Class exists
    await prisma.class.upsert({
      where: { id: item.id },
      update: { name: item.name || `Class ${item.id}` },
      create: {
        id: item.id,
        name: item.name || `Class ${item.id}`,
      },
    })

    // 2. Upsert Book Set
    const existingSet = await prisma.bookSet.findFirst({
      where: { classId: item.id }
    })
    
    if (existingSet) {
      await prisma.bookSet.update({
        where: { id: existingSet.id },
        data: { price: item.setPrice }
      })
    } else {
      await prisma.bookSet.create({
        data: {
          classId: item.id,
          price: item.setPrice
        }
      })
    }

    // 3. Upsert Individual Books
    for (const book of item.books) {
      const existingBook = await prisma.book.findFirst({
        where: { name: book.name, classId: item.id }
      })
      
      if (existingBook) {
        await prisma.book.update({
          where: { id: existingBook.id },
          data: { price: book.price }
        })
      } else {
        await prisma.book.create({
          data: {
            name: book.name,
            price: book.price,
            classId: item.id
          }
        })
      }
    }
  }

  // 4. Seed Teachers
  const teachers = [
    { name: 'Kunhappu Usthad', classIds: [1, 2] },
    { name: 'Thangal Usthad', classIds: [8] },
    { name: 'Latheef Usthad', classIds: [3, 9] },
    { name: 'Shafi Usthad', classIds: [6] },
    { name: 'Salman Usthad', classIds: [5, 10] },
    { name: 'Unais Usthad', classIds: [7] },
    { name: 'Rahoof Usthad', classIds: [4] },
  ]

  for (const t of teachers) {
    const existing = await prisma.teacher.findFirst({
      where: { name: t.name }
    })

    if (existing) {
      await prisma.teacher.update({
        where: { id: existing.id },
        data: {
          classes: {
            set: t.classIds.map(id => ({ id }))
          }
        }
      })
    } else {
      await prisma.teacher.create({
        data: {
          name: t.name,
          classes: {
            connect: t.classIds.map(id => ({ id }))
          }
        }
      })
    }
  }

  console.log('Seed: Data populated successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
