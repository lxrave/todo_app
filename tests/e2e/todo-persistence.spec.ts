import { test, expect } from '@playwright/test'
import { TodoAppPage } from './page-objects/todo-app'

test.describe('Todo: persistence (localStorage)', () => {
  test('added task persists after reload', async ({ page }) => {
    const todo = new TodoAppPage(page)
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    await todo.addTask('Persist this')
    await expect(todo.getTaskByText('Persist this')).toBeVisible()

    await page.reload()
    await expect(todo.getTaskByText('Persist this')).toBeVisible()
  })

  test('toggled task state persists after reload', async ({ page }) => {
    const todo = new TodoAppPage(page)
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    await todo.addTask('Complete me')
    await todo.toggleTaskByText('Complete me')
    await expect(todo.isTaskCompleted('Complete me')).resolves.toBe(true)

    await page.reload()
    await expect(todo.getTaskByText('Complete me')).toBeVisible()
    await expect(todo.isTaskCompleted('Complete me')).resolves.toBe(true)
  })
})
