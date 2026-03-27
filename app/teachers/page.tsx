import { getTeachers, createTeacher, deleteTeacher } from '@/lib/actions/teacher'
import { getClasses } from '@/lib/actions/class'
import TeacherList from '@/components/TeacherList'

export default async function TeachersPage() {
  const teachers = await getTeachers()
  const classes = await getClasses()

  return (
    <div className="container">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Teachers</h1>
      </header>

      <div className="grid gap-8">
        <TeacherList initialTeachers={teachers} classes={classes} />
      </div>
    </div>
  )
}
