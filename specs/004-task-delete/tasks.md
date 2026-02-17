# Tasks: Удаление задачи (004-task-delete)

**Input**: Design documents from `/specs/004-task-delete/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/e2e-selectors.md

**Organization**: Одна пользовательская история (US1, P1); задачи сгруппированы по фазам. E2E включается после реализации (включить сценарий и обновить page object).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Можно выполнять параллельно с другими задачами без зависимостей
- **[Story]**: Метка пользовательской истории (US1)
- В описаниях указаны конкретные пути к файлам

---

## Phase 1: Setup

**Purpose**: Проверить окружение и ветку фичи

- [x] T001 Verify branch `004-task-delete` and run `npm install` at repo root; ensure `npm run dev` and `npm run test` pass before feature changes

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Действие в store, без которого UI не может удалять задачу

**⚠️ CRITICAL**: Задачи US1 зависят от завершения этой фазы

- [x] T002 Add `deleteTask(id: string)` action in `src/stores/todoStore.ts`: find task by id, remove from `this.tasks` array if found, call `saveToStorage(this.tasks)`; if id not found do nothing (no-op) per data-model.md

**Checkpoint**: Store готов — можно подключать UI и E2E

---

## Phase 3: User Story 1 — Удаление задачи по иконке корзины с подтверждением (Priority: P1) 🎯 MVP

**Goal**: На каждой карточке справа видна иконка корзины; клик открывает диалог «Удалить задачу «[текст]»?» с кнопками «Отмена» и «Удалить»; подтверждение удаляет задачу безвозвратно; отмена / Escape / клик вне закрывают диалог без удаления. На мобиле текст не перекрывает иконку.

**Independent Test**: Добавить задачу → увидеть иконку на карточке → клик по иконке → в диалоге «Удалить» → задача исчезла, после перезагрузки нет. Повторить с «Отмена» — задача остаётся.

### Implementation for User Story 1

- [x] T003 [US1] In `src/components/TaskItem.vue` add delete button (trash icon) inside card on the right: always visible, `aria-label="Удалить задачу"`, `data-testid="task-delete-btn"`; ensure `.task-text` has `min-width: 0` so text does not overlap icon on narrow viewports per research.md; clicking button sets local state to show confirm dialog
- [x] T004 [US1] In `src/components/TaskItem.vue` add confirm dialog: overlay + dialog with message «Удалить задачу «{{ task.text }}»?», buttons «Отмена» and «Удалить»; handle Escape and click on overlay to close without deleting; on «Удалить» call `store.deleteTask(task.id)` and close dialog; use `role="dialog"` and accessible button names per specs/004-task-delete/contracts/e2e-selectors.md
- [x] T005 [P] [US1] In `tests/e2e/page-objects/todo-app.ts` add methods for delete flow per contracts/e2e-selectors.md: e.g. `getDeleteButtonForTask(taskText: string)`, `getConfirmDeleteDialog()`, `clickConfirmDelete()`, `clickCancelDelete()` using getByRole/ getByText as in contract
- [x] T006 [US1] In `tests/e2e/todo-delete.spec.ts` remove `test.skip`, implement scenario: add task with unique text, get delete button for that task and click, in dialog click «Удалить», assert task is not in list and after reload still absent; add second test or scenario: open delete dialog then click «Отмена» (or Escape / overlay) and assert task still visible

**Checkpoint**: User Story 1 реализована и проверяется E2E; удаление и отмена работают по спецификации

---

## Phase 4: Polish & Cross-Cutting

**Purpose**: Проверка по quickstart и актуализация контрактов

- [x] T007 Run verification from `specs/004-task-delete/quickstart.md`: manual check of delete flow, empty list after last task deleted, then `npm run test` and `npm run test:e2e` (with app running)
- [x] T008 [P] In `specs/002-todo-e2e-headless/contracts/e2e-selectors.md` add a short note under «Удалить задачу» that implementation and selectors are in `specs/004-task-delete/contracts/e2e-selectors.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 — T002 must complete before any US1 implementation
- **Phase 3 (US1)**: Depends on Phase 2
  - T003, T004: sequential (same file TaskItem.vue); T003 before T004 if splitting dialog open vs dialog content
  - T005 can be done in parallel with T003/T004 (different file)
  - T006 after T004 and T005 (E2E needs implementation and page object)
- **Phase 4 (Polish)**: After Phase 3

### User Story Dependencies

- **User Story 1 (P1)**: Only story; depends on Foundational (T002). No other stories.

### Parallel Opportunities

- T005 [P] can run in parallel with T003/T004 (page object vs component work)
- T007 and T008 in Phase 4 can be done in any order; T008 [P] is independent

### Suggested Order (Single Developer)

1. T001 → T002  
2. T003 → T004 (or T003+T004 in one commit)  
3. T005 then T006  
4. T007, T008  

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 (T001)  
2. Complete Phase 2 (T002)  
3. Complete Phase 3 (T003–T006)  
4. **STOP and VALIDATE**: Run quickstart checks and E2E  
5. Phase 4 (T007–T008) for polish  

### Task Count Summary

| Phase        | Task IDs | Count |
|-------------|----------|-------|
| Setup       | T001     | 1     |
| Foundational| T002     | 1     |
| US1         | T003–T006| 4     |
| Polish      | T007–T008| 2     |
| **Total**   |          | **8** |

- **Per story**: US1 = 4 implementation tasks (T003–T006)  
- **Parallel**: T005 [P] with T003/T004; T008 [P] in Phase 4  
- **MVP scope**: Phases 1–3 (T001–T006) deliver full delete feature with E2E

---

## Notes

- Each task is in checklist format with ID and file paths
- [P] only where task is in a different file and has no dependency on unfinished work
- [US1] on all Phase 3 tasks
- Commit after T002, after T004, and after T006 recommended
