import { test, expect } from '@playwright/test'
import { TodoAppPage } from './page-objects/todo-app'

test.describe('Todo: add task', () => {
  test('adds a task and it appears in the list', async ({ page }) => {
    const todo = new TodoAppPage(page)
    await page.goto('/')

    await todo.addTask('E2E test task')
    await expect(todo.getTaskByText('E2E test task')).toBeVisible()
  })

  test('from empty list: one task is visible after add', async ({ page }) => {
    const todo = new TodoAppPage(page)
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    await todo.addTask('First task')
    await expect(todo.getTaskByText('First task')).toBeVisible()
    await expect(todo.getTaskListItems()).toHaveCount(1)
  })
})
