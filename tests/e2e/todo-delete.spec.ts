import { test } from '@playwright/test'
import { TodoAppPage } from './page-objects/todo-app'

test.describe('Todo: delete task', () => {
  test('deletes a task and it disappears from the list', async ({ page }) => {
    const todo = new TodoAppPage(page)
    await page.goto('/')
    const taskText = `Task to delete ${Date.now()}`
    await todo.addTask(taskText)
    await todo.getDeleteButtonForTask(taskText).waitFor({ state: 'visible', timeout: 10_000 })
    await todo.getDeleteButtonForTask(taskText).click()
    await todo.getConfirmDeleteDialog().waitFor({ state: 'visible', timeout: 5_000 })
    await todo.clickConfirmDelete()
    await todo.getTaskByText(taskText).waitFor({ state: 'hidden', timeout: 5_000 })
    await page.reload()
    await todo.getTaskByText(taskText).waitFor({ state: 'hidden', timeout: 2_000 })
  })

  test('cancel delete keeps the task in the list', async ({ page }) => {
    const todo = new TodoAppPage(page)
    await page.goto('/')
    const taskText = `Task to keep ${Date.now()}`
    await todo.addTask(taskText)
    await todo.getDeleteButtonForTask(taskText).waitFor({ state: 'visible', timeout: 10_000 })
    await todo.getDeleteButtonForTask(taskText).click()
    await todo.getConfirmDeleteDialog().waitFor({ state: 'visible', timeout: 5_000 })
    await todo.clickCancelDelete()
    await todo.getConfirmDeleteDialog().waitFor({ state: 'hidden', timeout: 2_000 })
    await todo.getTaskByText(taskText).waitFor({ state: 'visible', timeout: 2_000 })
  })
})
