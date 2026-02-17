import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import TaskForm from '@/components/TaskForm.vue'

describe('TaskForm', () => {
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

  it('submit button is disabled when input is empty', () => {
    const wrapper = mount(TaskForm)
    const input = wrapper.find('input[type="text"]')
    const btn = wrapper.find('button[type="submit"]')

    input.setValue('')
    expect(btn.attributes('disabled')).toBeDefined()

    input.setValue('   ')
    expect(btn.attributes('disabled')).toBeDefined()
  })

  it('submit button is enabled when input has text', async () => {
    const wrapper = mount(TaskForm)
    const input = wrapper.find('input[type="text"]')
    const btn = wrapper.find('button[type="submit"]')

    await input.setValue('New task')
    expect(btn.attributes('disabled')).toBeUndefined()
  })

  it('submitting adds task and clears input', async () => {
    const wrapper = mount(TaskForm)
    const input = wrapper.find('input[type="text"]')
    const form = wrapper.find('form')

    await input.setValue('New task')
    await form.trigger('submit.prevent')

    const store = (await import('@/stores/todoStore')).useTodoStore()
    expect(store.tasks).toHaveLength(1)
    expect(store.tasks[0].text).toBe('New task')
    expect((input.element as HTMLInputElement).value).toBe('')
  })
})
