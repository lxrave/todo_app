/**
 * Задача в списке (по data-model.md и contracts/task-types.md).
 */
export interface Task {
  id: string
  text: string
  completed: boolean
  order: number
}
