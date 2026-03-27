'use client'

import { useState } from 'react'
import { createTeacher, updateTeacher, deleteTeacher } from '@/lib/actions/teacher'
import { UserPlus, Pencil, Trash2, X, GraduationCap, Phone, Check, Users } from 'lucide-react'

export default function TeacherList({ initialTeachers, classes }: { initialTeachers: any[], classes: any[] }) {
  const [teachers, setTeachers] = useState(initialTeachers)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [selectedClasses, setSelectedClasses] = useState<number[]>([])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      const updated = await updateTeacher(editingId, { name, contact, classIds: selectedClasses })
      setTeachers(teachers.map(t => t.id === editingId ? { ...updated, classes: classes.filter(c => selectedClasses.includes(c.id)) } : t))
      setEditingId(null)
    } else {
      const created = await createTeacher({ name, contact, classIds: selectedClasses })
      setTeachers([...teachers, { ...created, classes: classes.filter(c => selectedClasses.includes(c.id)), orders: [], payments: [] }])
      setIsAdding(false)
    }
    setName('')
    setContact('')
    setSelectedClasses([])
  }

  const startEdit = (t: any) => {
    setEditingId(t.id)
    setName(t.name)
    setContact(t.contact || '')
    setSelectedClasses(t.classes.map((c: any) => c.id))
    setIsAdding(true)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
        <h2 className="text-2xl font-black flex items-center gap-3 tracking-tight">
          <div className="p-2 bg-primary/20 rounded-xl text-primary ring-1 ring-primary/30">
            <Users size={28} />
          </div>
          <span className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent underline decoration-primary/40 underline-offset-8">Faculty Directory</span>
        </h2>
        {!isAdding && (
          <button className="btn btn-primary group overflow-hidden" onClick={() => setIsAdding(true)}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <UserPlus size={18} />
            <span>Add Teacher</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSave} className="card flex flex-col gap-6 ring-1 ring-primary/20">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Pencil size={20} />
            </div>
            <h3 className="text-lg font-bold">{editingId ? 'Update Teacher Details' : 'Onboard New Teacher'}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              className="input-field" 
              placeholder="Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
            />
            <input 
              className="input-field" 
              placeholder="Contact (Optional)" 
              value={contact} 
              onChange={e => setContact(e.target.value)} 
            />
          </div>
          <div>
            <p className="text-sm text-muted mb-2">Assigned Classes</p>
            <div className="flex flex-wrap gap-2">
              {classes.map(c => (
                <label key={c.id} className="flex items-center gap-2 text-sm">
                  <input 
                    type="checkbox" 
                    checked={selectedClasses.includes(c.id)} 
                    onChange={e => {
                      if (e.target.checked) setSelectedClasses([...selectedClasses, c.id])
                      else setSelectedClasses(selectedClasses.filter(id => id !== c.id))
                    }}
                  />
                  {c.name}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 justify-end pt-4 border-t border-border">
            <button type="button" className="btn btn-secondary" onClick={() => { setIsAdding(false); setEditingId(null); }}>
              <X size={18} />
              <span>Cancel</span>
            </button>
            <button type="submit" className="btn btn-primary">
              <Check size={18} />
              <span>{editingId ? 'Save Changes' : 'Confirm Addition'}</span>
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teachers.map(t => (
          <div key={t.id} className="card flex flex-col justify-between group relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-500"></div>
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="flex flex-col">
                  <p className="font-black text-2xl tracking-tight text-white group-hover:text-primary transition-colors">{t.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground/80 mt-2 font-medium">
                    <div className="p-1 bg-secondary rounded-md">
                      <Phone size={12} className="text-primary/70" />
                    </div>
                    <span>{t.contact || 'No contact info'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 text-muted-foreground hover:text-white hover:bg-white/10 rounded-xl transition-all border border-transparent hover:border-white/10" title="Edit Teacher" onClick={() => startEdit(t)}>
                    <Pencil size={18} />
                  </button>
                  <button className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all border border-transparent hover:border-destructive/20" title="Delete Teacher" onClick={async () => {
                    if (confirm('Permanently delete this teacher?')) {
                      await deleteTeacher(t.id)
                      setTeachers(teachers.filter(item => item.id !== t.id))
                    }
                  }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Assigned Curriculum</p>
                <div className="flex flex-wrap gap-2">
                  {t.classes.map((c: any) => (
                    <span key={c.id} className="inline-flex items-center gap-2 text-[11px] font-bold bg-white/5 hover:bg-white/10 text-white/90 px-3 py-1.5 rounded-lg border border-white/5 transition-colors shadow-sm">
                      <GraduationCap size={12} className="text-primary" />
                      {c.name}
                    </span>
                  ))}
                  {t.classes.length === 0 && (
                    <span className="text-xs text-muted-foreground/40 italic flex items-center gap-2">
                      <Users size={12} />
                      Unassigned
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Progress/Status Simulation for "Million Dollar" look */}
            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-muted-foreground/40">
              <span className="uppercase tracking-widest">Active Faculty</span>
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-success/50 animate-pulse"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-white/10"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
