import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTodoStore } from '@/stores/todoStore'

describe('todoStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      length: 0,
      key: vi.fn(),
    })
    setActivePinia(createPinia())
  })

  it('addTask adds a task with trimmed text and persists', () => {
    const store = useTodoStore()
    store.loadTasks()

    store.addTask('  First task  ')
    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0].text).toBe('First task')
    expect(store.tasks[0].completed).toBe(false)
    expect(store.tasks[0].id).toBeDefined()
    expect(store.tasks[0].order).toBe(0)

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('addTask does not add when text is empty after trim', () => {
    const store = useTodoStore()
    store.loadTasks()

    store.addTask('')
    store.addTask('   ')
    expect(store.tasks).toHaveLength(0)
  })

  it('toggleTask flips completed and persists', () => {
    const store = useTodoStore()
    store.loadTasks()
    store.addTask('Task')
    const id = store.tasks[0].id

    expect(store.tasks[0].completed).toBe(false)
    store.toggleTask(id)
    expect(store.tasks[0].completed).toBe(true)
    store.toggleTask(id)
    expect(store.tasks[0].completed).toBe(false)

    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('toggleTask is no-op when id not found', () => {
    const store = useTodoStore()
    store.loadTasks()
    store.addTask('Task')

    store.toggleTask('non-existent')
    expect(store.tasks[0].completed).toBe(false)
  })

  it('reorderTasks updates order and persists', () => {
    const store = useTodoStore()
    store.loadTasks()
    store.addTask('A')
    store.addTask('B')
    store.addTask('C')

    store.reorderTasks(1, 0)
    expect(store.sortedTasks[0].text).toBe('B')
    expect(store.sortedTasks[1].text).toBe('A')
    expect(store.sortedTasks[2].text).toBe('C')
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('loadTasks returns empty array when localStorage has invalid JSON', () => {
    vi.mocked(localStorage.getItem).mockReturnValueOnce('not json')
    const store = useTodoStore()
    store.loadTasks()
    expect(store.tasks).toHaveLength(0)
  })

  it('deleteTask removes task and persists', () => {
    const store = useTodoStore()
    store.loadTasks()
    store.addTask('To delete')
    store.addTask('To keep')
    const idToDelete = store.tasks[0].id
    expect(store.tasks).toHaveLength(2)

    store.deleteTask(idToDelete)
    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0].text).toBe('To keep')
    expect(localStorage.setItem).toHaveBeenCalled()
  })

  it('deleteTask is no-op when id not found', () => {
    const store = useTodoStore()
    store.loadTasks()
    store.addTask('Only task')
    const before = store.tasks.length

    store.deleteTask('non-existent-id')
    expect(store.tasks).toHaveLength(before)
    expect(store.tasks[0].text).toBe('Only task')
  })
})
