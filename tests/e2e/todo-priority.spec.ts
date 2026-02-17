import { test, expect } from '@playwright/test'
import { TodoAppPage } from './page-objects/todo-app'

test.describe('Todo: task priority', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('new task has default priority Medium', async ({ page }) => {
    const todo = new TodoAppPage(page)
    await todo.addTask('Default priority task')
    await expect(todo.getTaskByText('Default priority task')).toBeVisible()
    await expect(todo.getPriorityButtonForTask('Default priority task')).toBeVisible({ timeout: 10_000 })
    await expect(todo.getPriorityButtonForTask('Default priority task')).toHaveText('Medium')
  })

  test('can change priority via dropdown', async ({ page }) => {
    const todo = new TodoAppPage(page)
    await todo.addTask('Change me')
    await todo.setPriorityForTask('Change me', 'High')
    await expect(todo.getPriorityButtonForTask('Change me')).toHaveText('High')

    await todo.setPriorityForTask('Change me', 'Low')
    await expect(todo.getPriorityButtonForTask('Change me')).toHaveText('Low')
  })

  test('priority dropdown is not covered by cards below after changing priority', async ({ page }) => {
    const todo = new TodoAppPage(page)
    await todo.addTask('First task')
    await todo.addTask('Second task')

    await todo.setPriorityForTask('First task', 'High')
    await expect(todo.getPriorityButtonForTask('First task')).toHaveText('High')

    await todo.openPriorityDropdownForTask('Second task')
    await expect(todo.priorityListbox).toBeVisible()
    await todo.selectPriorityInDropdown('Low')
    await expect(todo.getPriorityButtonForTask('Second task')).toHaveText('Low')
  })

  test('cancel by Escape does not change priority', async ({ page }) => {
    const todo = new TodoAppPage(page)
    await todo.addTask('Escape me')
    await todo.openPriorityDropdownForTask('Escape me')
    await expect(todo.priorityListbox).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(todo.priorityListbox).not.toBeVisible()
    await expect(todo.getPriorityButtonForTask('Escape me')).toHaveText('Medium')
  })

  test('priority persists after reload', async ({ page }) => {
    const todo = new TodoAppPage(page)
    await todo.addTask('Persist priority')
    await todo.setPriorityForTask('Persist priority', 'High')
    await page.reload()
    await expect(todo.getPriorityButtonForTask('Persist priority')).toHaveText('High')
  })
})
