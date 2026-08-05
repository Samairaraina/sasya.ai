import { useState, useEffect } from 'react'
import { CalendarClock, CheckCircle2, Plus } from 'lucide-react'

interface Task {
  id: string
  task: string
  date: string
  status: 'pending' | 'completed'
}

export function TasksWidget({ onPendingCountChange }: { onPendingCountChange?: (count: number) => void }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTaskText, setNewTaskText] = useState('')
  const [isAddingTask, setIsAddingTask] = useState(false)

  useEffect(() => {
    const savedTasks = localStorage.getItem('sasya_tasks')
    if (savedTasks) {
      try { 
        const parsed = JSON.parse(savedTasks)
        setTasks(parsed)
        if (onPendingCountChange) {
          onPendingCountChange(parsed.filter((t: Task) => t.status === 'pending').length)
        }
      } catch (e) {}
    }
  }, [onPendingCountChange])

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskText.trim()) return
    const newTask: Task = {
      id: Date.now().toString(),
      task: newTaskText,
      date: new Date().toLocaleDateString(),
      status: 'pending'
    }
    const updated = [newTask, ...tasks]
    setTasks(updated)
    localStorage.setItem('sasya_tasks', JSON.stringify(updated))
    setNewTaskText('')
    setIsAddingTask(false)
    if (onPendingCountChange) onPendingCountChange(updated.filter(t => t.status === 'pending').length)
  }

  const toggleTaskStatus = (id: string) => {
    const updated = tasks.map(t => {
      if (t.id === id) {
        return { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } as Task
      }
      return t
    })
    setTasks(updated)
    localStorage.setItem('sasya_tasks', JSON.stringify(updated))
    if (onPendingCountChange) onPendingCountChange(updated.filter(t => t.status === 'pending').length)
  }

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id)
    setTasks(updated)
    localStorage.setItem('sasya_tasks', JSON.stringify(updated))
    if (onPendingCountChange) onPendingCountChange(updated.filter(t => t.status === 'pending').length)
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.02] p-6 backdrop-blur">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-white/50 uppercase tracking-wider">
          <CalendarClock size={16} className="text-butter" />
          Tasks & Reminders
        </div>
        <button 
          onClick={() => setIsAddingTask(!isAddingTask)}
          className="rounded-full bg-white/10 p-1.5 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="flex-1 flex flex-col gap-3 min-h-[150px]">
        {isAddingTask && (
          <form onSubmit={handleAddTask} className="flex gap-2">
            <input 
              type="text" 
              autoFocus
              placeholder="Enter a new task..." 
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder-white/40 focus:border-butter focus:outline-none"
            />
            <button type="submit" className="rounded-xl bg-butter/20 text-butter hover:bg-butter/30 px-3 py-2 text-sm font-semibold transition-colors">Add</button>
          </form>
        )}

        {tasks.length === 0 && !isAddingTask ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="rounded-full bg-white/5 p-3 mb-2"><CalendarClock size={20} className="text-white/20" /></div>
            <p className="text-sm font-semibold text-white/70">No tasks yet</p>
            <p className="text-xs text-white/40 mt-1">Click the + button to add one.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className={`group flex items-start justify-between gap-3 rounded-xl border border-white/[0.05] p-3 transition-colors ${task.status === 'completed' ? 'bg-white/[0.01] opacity-50' : 'bg-white/[0.02] hover:bg-white/[0.06]'}`}>
              <div className="flex items-start gap-3">
                <button onClick={() => toggleTaskStatus(task.id)}>
                  <CheckCircle2 size={18} className={`mt-0.5 transition-colors ${task.status === 'completed' ? 'text-emerald-500' : 'text-white/20 hover:text-emerald-400'}`} />
                </button>
                <div>
                  <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-white/50 line-through' : 'text-white/90'}`}>{task.task}</p>
                  <p className="text-[10px] text-white/40 mt-0.5">{task.date}</p>
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus size={16} className="rotate-45" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
