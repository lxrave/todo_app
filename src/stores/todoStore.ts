import { defineStore } from 'pinia'
import type { Task } from '@/types/task'
import {
  DEFAULT_PRIORITY,
  normalizePriority,
  PRIORITY_ORDER,
  type TaskPriority,
} from '@/types/task'

const STORAGE_KEY = 'todo-app-tasks'

function loadFromStorage(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw == null) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.map((t: Record<string, unknown>) => ({
      id: t.id,
      text: t.text,
      completed: Boolean(t.completed),
      order: Number(t.order) ?? 0,
      priority: normalizePriority(t.priority),
    })) as Task[]
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

function tasksWithPriority(tasks: Task[], priority: TaskPriority): Task[] {
  return [...tasks].filter((t) => t.priority === priority).sort((a, b) => a.order - b.order)
}

export const useTodoStore = defineStore('todo', {
  state: () => ({
    tasks: loadFromStorage() as Task[],
  }),

  getters: {
    /** Задачи, отсортированные по приоритету (High → Medium → Low), затем по order внутри группы. */
    sortedTasks(state): Task[] {
      const byPriority = PRIORITY_ORDER.flatMap((p) => tasksWithPriority(state.tasks, p))
      return byPriority
    },

    tasksByPriorityHigh(state): Task[] {
      return tasksWithPriority(state.tasks, 'High')
    },

    tasksByPriorityMedium(state): Task[] {
      return tasksWithPriority(state.tasks, 'Medium')
    },

    tasksByPriorityLow(state): Task[] {
      return tasksWithPriority(state.tasks, 'Low')
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
        priority: DEFAULT_PRIORITY,
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

    setPriority(id: string, priority: TaskPriority): void {
      const valid: TaskPriority[] = ['Low', 'Medium', 'High']
      if (!valid.includes(priority)) return
      const task = this.tasks.find((t) => t.id === id)
      if (!task) return
      const samePriority = this.tasks.filter((t) => t.priority === priority)
      const maxOrder =
        samePriority.length === 0 ? 0 : Math.max(...samePriority.map((t) => t.order), 0)
      task.priority = priority
      task.order = maxOrder + 1
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

    reorderTasksInGroup(priority: TaskPriority, fromIndex: number, toIndex: number): void {
      const group = tasksWithPriority(this.tasks, priority)
      const [removed] = group.splice(fromIndex, 1)
      if (!removed) return
      group.splice(toIndex, 0, removed)
      group.forEach((t, i) => {
        t.order = i
      })
      this.tasks = [...this.tasks]
      saveToStorage(this.tasks)
    },

    deleteTask(id: string): void {
      const index = this.tasks.findIndex((t) => t.id === id)
      if (index === -1) return
      this.tasks.splice(index, 1)
      saveToStorage(this.tasks)
    },
  },
})
