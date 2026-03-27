import { getClasses } from '@/lib/actions/class'
import BookManager from '@/components/BookManager'

export default async function BooksPage() {
  const classes = await getClasses()

  return (
    <div className="container">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Book Management</h1>
      </header>

      <BookManager classes={classes} />
    </div>
  )
}
