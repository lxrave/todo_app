import { defineStore } from 'pinia'
import type { Task } from '@/types/task'

const STORAGE_KEY = 'todo-app-tasks'

function loadFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw == null) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function saveToStorage(tasks: Task[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  } catch {
    // quota exceeded or other; avoid crashing
  }
}

function nextOrder(tasks: Task[]): number {
  if (tasks.length === 0) return 0
  return Math.max(...tasks.map((t) => t.order), 0) + 1
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    tasks: loadFromStorage() as Task[],
  }),

  getters: {
    sortedTasks(state): Task[] {
      return [...state.tasks].sort((a, b) => a.order - b.order)
    },
  },

  actions: {
    loadTasks(): void {
      this.tasks = loadFromStorage()
    },

    addTask(text: string): void {
      const trimmed = text.trim()
      if (trimmed === '') return
      const order = nextOrder(this.tasks)
      const task: Task = {
        id: crypto.randomUUID(),
        text: trimmed,
        completed: false,
        order,
      }
      this.tasks.push(task)
      saveToStorage(this.tasks)
    },

    toggleTask(id: string): void {
      const task = this.tasks.find((t) => t.id === id)
      if (!task) return
      task.completed = !task.completed
      saveToStorage(this.tasks)
    },

    reorderTasks(fromIndex: number, toIndex: number): void {
      const sorted = [...this.tasks].sort((a, b) => a.order - b.order)
      const [removed] = sorted.splice(fromIndex, 1)
      if (!removed) return
      sorted.splice(toIndex, 0, removed)
      sorted.forEach((t, i) => {
        t.order = i
      })
      this.tasks = sorted
      saveToStorage(this.tasks)
    },
  },
})
