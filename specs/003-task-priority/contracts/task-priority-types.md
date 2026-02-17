# Контракт: типы и API приоритета задачи (003-task-priority)

**Фича**: 003-task-priority  
**Назначение**: Расширение типа Task и API хранилища для приоритета. Базируется на контрактах 001-todo-list (task-types.md).

---

## Тип приоритета и расширение Task

```ts
type TaskPriority = 'Low' | 'Medium' | 'High'

interface Task {
  id: string
  text: string
  completed: boolean
  order: number
  priority: TaskPriority  // новое поле
}
```

- Допустимые значения: строго `'Low'`, `'Medium'`, `'High'`.
- При загрузке из хранилища: отсутствующее или невалидное значение трактовать как `'Medium'`.

---

## Константы (ориентировочно)

- **Приоритет по умолчанию**: `'Medium'`.
- **Порядок уровней для отображения**: `['High', 'Medium', 'Low']` (индекс или порядок сортировки).
- **Цвета карточек** (еле уловимые): High — red, Medium — yellow, Low — blue (конкретные оттенки — в реализации, например CSS-переменные или классы `.priority-high`, `.priority-medium`, `.priority-low`).

---

## Расширение API хранилища (Pinia store)

**State**: без изменения структуры; каждая задача в `tasks` содержит поле `priority`.

**Getters** (дополнение/изменение):
- `sortedTasks`: список задач, отсортированный сначала по приоритету (High → Medium → Low), затем по `order` внутри группы. Либо отдельные геттеры `tasksByPriorityHigh`, `tasksByPriorityMedium`, `tasksByPriorityLow` для рендера по группам.

**Actions** (дополнение):
- `setPriority(id: string, priority: TaskPriority): void` — установить приоритет задачи с данным id; если задача не найдена или priority невалиден — no-op. Пересчитать `order` задачи так, чтобы она оказалась в конце группы с новым приоритетом. Сохранить в localStorage.
- `reorderTasksInGroup(priority: TaskPriority, fromIndex: number, toIndex: number): void` — изменить порядок только среди задач с данным приоритетом; пересчитать `order` у затронутых задач и сохранить в localStorage. (Альтернатива: оставить `reorderTasks(fromIndex, toIndex)` в рамках уже отфильтрованного по группе списка — тогда индексы относятся к группе.)

**Сохранение**: тот же ключ localStorage; сериализация полного массива `Task[]` после каждой мутации.

---

## Валидация на границах

- При загрузке: если `task.priority` отсутствует или не в `['Low','Medium','High']` → `task.priority = 'Medium'`.
- При вызове `setPriority(id, 'Invalid')` или несуществующий id: no-op, без падения.
