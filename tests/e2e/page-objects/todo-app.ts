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
    return this.page.locator('.task-item')
  }

  /** Task row: .task-item is the card (li); avoids matching dropdown option li. */
  getTaskByText(text: string): Locator {
    return this.page.locator('.task-item').filter({ hasText: text })
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

  /** Priority button: кнопка в .priority-wrap внутри карточки. */
  getPriorityButtonForTask(text: string): Locator {
    return this.getTaskByText(text).locator('.priority-wrap button')
  }

  /** Open priority dropdown for the task with given text (ждёт появления кнопки). */
  async openPriorityDropdownForTask(text: string): Promise<void> {
    const btn = this.getPriorityButtonForTask(text)
    await btn.waitFor({ state: 'visible', timeout: 10_000 })
    await btn.click()
  }

  /** Visible listbox (priority dropdown). Use after opening a dropdown. */
  get priorityListbox(): Locator {
    return this.page.getByRole('listbox', { name: /Выберите приоритет/ })
  }

  /** Select priority in the open dropdown (Low, Medium, High). */
  async selectPriorityInDropdown(priority: 'Low' | 'Medium' | 'High'): Promise<void> {
    await this.page.getByRole('option', { name: priority }).click()
  }

  /** Set priority for task: open dropdown and select value. */
  async setPriorityForTask(taskText: string, priority: 'Low' | 'Medium' | 'High'): Promise<void> {
    await this.openPriorityDropdownForTask(taskText)
    await this.selectPriorityInDropdown(priority)
  }

  /** Current priority label for task (text of the priority button). */
  async getPriorityForTask(text: string): Promise<string> {
    return await this.getPriorityButtonForTask(text).textContent() ?? ''
  }

  /** Delete button (trash icon) for the task with given text. Per specs/004-task-delete/contracts/e2e-selectors.md */
  getDeleteButtonForTask(taskText: string): Locator {
    return this.getTaskByText(taskText).getByRole('button', { name: 'Удалить задачу' })
  }

  /** Confirm delete dialog (role="dialog"). */
  getConfirmDeleteDialog(): Locator {
    return this.page.getByRole('dialog')
  }

  /** Click "Удалить" in the confirm delete dialog. */
  async clickConfirmDelete(): Promise<void> {
    await this.getConfirmDeleteDialog().getByRole('button', { name: 'Удалить' }).click()
  }

  /** Click "Отмена" in the confirm delete dialog. */
  async clickCancelDelete(): Promise<void> {
    await this.getConfirmDeleteDialog().getByRole('button', { name: 'Отмена' }).click()
  }
}
