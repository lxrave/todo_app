# Implementation Plan: Удаление задачи

**Branch**: `004-task-delete` | **Date**: 2026-02-16 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/004-task-delete/spec.md`

## Summary

Добавить безвозвратное удаление задачи по иконке корзины с обязательным диалогом подтверждения. Иконка всегда видна справа внутри карточки; на мобиле текст не перекрывает иконку. Диалог: «Удалить задачу «[текст]»?» с кнопками «Отмена» и «Удалить»; закрытие по Escape или клику вне приравнивается к отмене. Реализация в существующем стеке: Vue 3, Pinia, localStorage.

## Technical Context

**Language/Version**: TypeScript ~5.4  
**Primary Dependencies**: Vue 3.4, Pinia 2.x, Vite 5.x  
**Storage**: localStorage (ключ `todo-app-tasks`, JSON-массив задач)  
**Testing**: Vitest (unit), Playwright (E2E)  
**Target Platform**: Web (десктоп и мобильные браузеры)  
**Project Type**: SPA (Vue), один фронтенд  
**Performance Goals**: Мгновенный отклик UI на клик; диалог открывается без задержки  
**Constraints**: Без бэкенда; удаление только из клиентского хранилища  
**Scale/Scope**: Локальное приложение, объём данных — порядок сотен задач

## Проверка соответствия конституции

- **Чистый и поддерживаемый код**: Иконка и диалог вносятся в существующий компонент карточки (TaskItem) и store; именование в духе `deleteTask`, `confirmDelete` — по соглашениям проекта.
- **Тестируемость и код-ревью**: E2E-сценарий удаления уже заготовлен (todo-delete.spec.ts, пока skip); после реализации — включить и при необходимости обновить page object и контракт селекторов.
- **Интуитивный и минималистичный UX**: Одна иконка корзины на карточку, один диалог с явным подтверждением — без лишней сложности.
- **Расширяемость**: Добавление действия `deleteTask` в store и кнопки в UI не меняет контракты существующих действий (add, toggle, setPriority, reorder).
- **Целостность данных**: Удаление — удаление из массива и сохранение в localStorage; при отмене диалога данные не меняются.
- **Устойчивость к ошибкам и валидация**: Диалог подтверждения снижает случайное удаление; при вызове `deleteTask(id)` для несуществующего id — no-op (store).
- **Стандарты качества кода**: Структура и стиль как в 003-task-priority (компонент + store action + типы).

Любое отступление ДОЛЖНО быть обосновано в блоке «Отслеживание сложности» ниже.

## Project Structure

### Documentation (this feature)

```text
specs/004-task-delete/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1 (E2E selectors for delete)
└── tasks.md             # Phase 2 (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── TaskItem.vue     # + иконка корзины, вызов диалога
│   ├── TaskList.vue
│   └── TaskForm.vue
├── stores/
│   └── todoStore.ts     # + action deleteTask(id)
├── types/
│   └── task.ts          # без изменений
├── views/
│   └── HomeView.vue
├── App.vue
└── main.ts

tests/
└── e2e/
    ├── todo-delete.spec.ts        # убрать skip, реализовать сценарий
    └── page-objects/
        └── todo-app.ts            # + методы для удаления (кнопка, диалог)
```

**Structure Decision**: Существующая структура Vue SPA; изменения только в TaskItem.vue (иконка + диалог), todoStore.ts (deleteTask), E2E-тесты и контракт селекторов.

## Complexity Tracking

Нет нарушений конституции; таблица пуста.
