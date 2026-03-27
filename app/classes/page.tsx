import { getClasses } from '@/lib/actions/class'
import { GraduationCap, BookOpen, Layers } from 'lucide-react'

export default async function ClassesPage() {
  const classes = await getClasses()

  return (
    <div className="container">
      <header className="mb-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <GraduationCap size={24} />
          </div>
          <h1 className="text-3xl font-bold">Curriculum & Sets</h1>
        </div>
        <p className="text-muted mt-2">Manage textbook inventory and full set pricing by class.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {classes.map(c => (
          <div key={c.id} className="card relative group hover:border-primary/50 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-secondary rounded-lg">
                <Layers size={18} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">{c.name}</h3>
            </div>
            
            <div className="space-y-6">
              {c.bookSets.map((s: any) => (
                <div key={s.id} className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex justify-between items-center transition-all group-hover:bg-primary/10">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/20 rounded-md text-primary">
                      <Layers size={14} />
                    </div>
                    <span className="font-bold text-sm tracking-wide uppercase">Full Book Set</span>
                  </div>
                  <span className="text-xl font-extrabold text-primary">₹{s.price}</span>
                </div>
              ))}

              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen size={14} className="text-muted" />
                  <p className="text-xs font-bold uppercase tracking-widest text-muted">Individual Books</p>
                </div>
                <div className="space-y-2">
                  {c.books.length > 0 ? (
                    c.books.map((b: any) => (
                      <div key={b.id} className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-secondary/50 transition-colors">
                        <span className="text-sm font-medium">{b.name}</span>
                        <span className="text-sm font-bold opacity-80">₹{b.price}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted italic p-3 text-center border border-dashed border-border rounded-lg">No individual books cataloged.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
