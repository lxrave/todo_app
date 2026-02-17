/**
 * Приоритет задачи (003-task-priority, contracts/task-priority-types.md).
 */
export type TaskPriority = 'Low' | 'Medium' | 'High'

/** Порядок уровней для отображения: High выше Medium выше Low. */
export const PRIORITY_ORDER: TaskPriority[] = ['High', 'Medium', 'Low']

/** Приоритет по умолчанию для новой задачи. */
export const DEFAULT_PRIORITY: TaskPriority = 'Medium'

const VALID_PRIORITIES: Set<string> = new Set(['Low', 'Medium', 'High'])

/** Нормализовать значение при загрузке: невалидное → Medium. */
export function normalizePriority(value: unknown): TaskPriority {
  if (typeof value === 'string' && VALID_PRIORITIES.has(value)) {
    return value as TaskPriority
  }
  return DEFAULT_PRIORITY
}

/** CSS-класс карточки по приоритету (еле уловимый цвет: high=red, medium=yellow, low=blue). */
export function priorityToClass(priority: TaskPriority): string {
  const map: Record<TaskPriority, string> = {
    High: 'priority-high',
    Medium: 'priority-medium',
    Low: 'priority-low',
  }
  return map[priority] ?? 'priority-medium'
}

/**
 * Задача в списке (по data-model.md и contracts/task-types.md, 003-task-priority).
 */
export interface Task {
  id: string
  text: string
  completed: boolean
  order: number
  priority: TaskPriority
}
