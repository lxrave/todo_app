import { test } from '@playwright/test'

// Enable when Todo App implements delete (see specs/002-todo-e2e-headless/research.md).
test.describe('Todo: delete task', () => {
  test.skip('deletes a task and it disappears from the list', async () => {
    // When delete is implemented: add task, trigger delete (e.g. button per row),
    // assert task is not visible.
  })
})
