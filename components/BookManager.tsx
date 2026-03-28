'use client'

import { useState } from 'react'
import { createBook, updateBook, deleteBook, createOrUpdateBookSet } from '@/lib/actions/book'
import { Plus, Pencil, Trash2, Save, X, BookOpen, Layers, CheckCircle2 } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function BookManager({ classes }: { classes: any[] }) {
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || 1)
  const currentClass = classes.find(c => c.id === selectedClassId)
  
  const [bookName, setBookName] = useState('')
  const [bookPrice, setBookPrice] = useState('')
  const [setPrice, setSetPrice] = useState(currentClass?.bookSets[0]?.price.toString() || '0')

  const [editingBookId, setEditingBookId] = useState<string | null>(null)

  const handleAddOrUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingBookId) {
      await updateBook(editingBookId, { name: bookName, price: parseFloat(bookPrice) })
      setEditingBookId(null)
    } else {
      await createBook({ name: bookName, price: parseFloat(bookPrice), classId: selectedClassId })
    }
    setBookName('')
    setBookPrice('')
    window.location.reload()
  }

  const startEditBook = (b: any) => {
    setEditingBookId(b.id)
    setBookName(b.name)
    setBookPrice(b.price.toString())
  }

  const handleDeleteBook = async (id: string) => {
    if (confirm('Delete book?')) {
      await deleteBook(id)
      window.location.reload()
    }
  }

  const handleUpdateBookSet = async () => {
    await createOrUpdateBookSet(selectedClassId, parseFloat(setPrice))
    alert('Full Set price updated!')
    window.location.reload()
  }

  return (
    <div className="grid gap-8">
      {/* Class Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
        {classes.map(c => (
          <button 
            key={c.id} 
            className={cn(
              "btn whitespace-nowrap px-6 py-2 rounded-full border border-border transition-all",
              selectedClassId === c.id 
                ? "btn-primary shadow-lg shadow-primary/20 border-primary" 
                : "btn-secondary hover:border-muted-foreground/30"
            )}
            onClick={() => {
              setSelectedClassId(c.id)
              setSetPrice(c.bookSets[0]?.price.toString() || '0')
            }}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="flex flex-col gap-6">
          {/* Add/Edit Book Form */}
          <div className="card border-primary/20 bg-primary/5">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Plus className="text-primary" size={20} />
              <span>{editingBookId ? 'Update Catalog Entry' : 'Catalog New Book'}</span>
            </h3>
            
            <form onSubmit={handleAddOrUpdateBook} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">Book Name</label>
                  <input 
                    className="input-field" 
                    placeholder="e.g. Duroos II" 
                    value={bookName} 
                    onChange={e => setBookName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">Unit Price (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">₹</span>
                    <input 
                      className="input-field pl-8" 
                      type="number" 
                      placeholder="0.00" 
                      value={bookPrice} 
                      onChange={e => setBookPrice(e.target.value)} 
                      step="0.01"
                      required 
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2 justify-end mt-2">
                {editingBookId && (
                  <button type="button" className="btn btn-secondary" onClick={() => { setEditingBookId(null); setBookName(''); setBookPrice(''); }}>
                    <X size={18} />
                    <span>Cancel</span>
                  </button>
                )}
                <button type="submit" className="btn btn-primary">
                  {editingBookId ? <Save size={18} /> : <Plus size={18} />}
                  <span>{editingBookId ? 'Update Info' : 'Add to Catalog'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Individual Books List */}
          <div className="card">
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <BookOpen className="text-primary" size={20} />
              <span>Inventory List — {currentClass?.name}</span>
            </h3>
            
            <div className="grid grid-cols-1 gap-3">
              {currentClass?.books.map((b: any) => (
                <div key={b.id} className="flex justify-between items-center p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/60 transition-all group">
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg">{b.name}</span>
                    <span className="text-sm font-extrabold text-primary">₹{b.price.toLocaleString()}</span>
                  </div>
                  <div className="record-actions">
                    <button className="action-btn action-btn-edit" title="Edit Book" onClick={() => startEditBook(b)}>
                      <Pencil size={18} />
                    </button>
                    <button className="action-btn action-btn-delete" title="Delete Book" onClick={() => handleDeleteBook(b.id)}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {currentClass?.books.length === 0 && <p className="text-muted text-center py-12 italic border border-dashed border-border rounded-xl">No books cataloged for this class.</p>}
            </div>
          </div>
        </div>

        {/* Full Set Price Config */}
        <div className="card h-fit lg:sticky lg:top-8 border-warning/20 bg-warning/5">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Layers className="text-warning" size={24} />
            <span>Set Configuration</span>
          </h3>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted uppercase tracking-wider px-1">Full Set Total Price (₹)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-extrabold text-warning">₹</span>
                <input 
                  className="input-field pl-10 text-xl font-extrabold h-14" 
                  type="number" 
                  value={setPrice} 
                  onChange={e => setSetPrice(e.target.value)} 
                  step="0.01"
                />
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-background/50 border border-border/50 text-sm text-muted leading-relaxed">
              <p>A <strong>"Full Set"</strong> automatically aggregates all books for this class into a single order item. Useful for bulk purchasing.</p>
            </div>

            <button className="btn btn-primary w-full h-12 shadow-lg shadow-primary/30" onClick={handleUpdateBookSet}>
              <CheckCircle2 size={20} />
              <span>Apply Pricing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
