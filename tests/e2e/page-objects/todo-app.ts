import type { Page, Locator } from '@playwright/test'

/**
 * Page object for Todo App main screen (list + form).
 * Selectors follow specs/002-todo-e2e-headless/contracts/e2e-selectors.md.
 */
export class TodoAppPage {
  constructor(private readonly page: Page) {}

  get input(): Locator {
    return this.page.getByRole('textbox', { name: /Текст задачи/ })
  }

  get addButton(): Locator {
    return this.page.getByRole('button', { name: 'Добавить' })
  }

  get emptyMessage(): Locator {
    return this.page.getByText(/Список пуст|Добавьте задачу/)
  }

  get taskList(): Locator {
    return this.page.getByRole('list')
  }

  getTaskListItems(): Locator {
    return this.page.getByRole('listitem')
  }

  getTaskByText(text: string): Locator {
    return this.page.getByRole('listitem').filter({ hasText: text })
  }

  getCheckboxForTask(text: string): Locator {
    return this.getTaskByText(text).getByRole('checkbox')
  }

  /** Add a task: fill input and click Add. */
  async addTask(text: string): Promise<void> {
    await this.input.fill(text)
    await this.addButton.click()
  }

  /** Toggle completion for the task with given text (click checkbox). */
  async toggleTaskByText(text: string): Promise<void> {
    await this.getCheckboxForTask(text).click()
  }

  /** Whether the task is shown as completed (checkbox checked). */
  async isTaskCompleted(text: string): Promise<boolean> {
    return await this.getCheckboxForTask(text).isChecked()
  }
}
