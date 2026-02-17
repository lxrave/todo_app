import { test, expect } from '@playwright/test'
import { TodoAppPage } from './page-objects/todo-app'

test.describe('Todo: toggle task', () => {
  test('toggles task to completed and back', async ({ page }) => {
    const todo = new TodoAppPage(page)
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    await todo.addTask('Toggle me')
    await expect(todo.getTaskByText('Toggle me')).toBeVisible()

    await todo.toggleTaskByText('Toggle me')
    await expect(todo.isTaskCompleted('Toggle me')).resolves.toBe(true)

    await todo.toggleTaskByText('Toggle me')
    await expect(todo.isTaskCompleted('Toggle me')).resolves.toBe(false)
  })
})
