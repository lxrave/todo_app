<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { Task } from '@/types/task'
import { priorityToClass, type TaskPriority } from '@/types/task'
import { useTodoStore } from '@/stores/todoStore'

const props = defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: []
}>()

const store = useTodoStore()
const dropdownOpen = ref(false)
const priorityButtonRef = ref<HTMLElement | null>(null)
const deleteDialogOpen = ref(false)
const deleteDialogRef = ref<HTMLElement | null>(null)

const priorityClass = () => priorityToClass(props.task.priority)

const PRIORITIES: TaskPriority[] = ['Low', 'Medium', 'High']

function handleRowClick(): void {
  if (dropdownOpen.value) return
  emit('toggle')
}

function openDropdown(e: Event): void {
  e.stopPropagation()
  dropdownOpen.value = true
}

function selectPriority(priority: TaskPriority): void {
  store.setPriority(props.task.id, priority)
  dropdownOpen.value = false
}

function onKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    if (deleteDialogOpen.value) {
      deleteDialogOpen.value = false
    } else {
      dropdownOpen.value = false
    }
  }
}

function onDocumentClick(e: Event): void {
  if (deleteDialogOpen.value) {
    const dialogEl = deleteDialogRef.value
    if (dialogEl && !dialogEl.contains(e.target as Node)) {
      deleteDialogOpen.value = false
    }
    return
  }
  if (!dropdownOpen.value) return
  const el = priorityButtonRef.value
  if (el && !el.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

function openDeleteDialog(e: Event): void {
  e.stopPropagation()
  deleteDialogOpen.value = true
}

function confirmDelete(): void {
  store.deleteTask(props.task.id)
  deleteDialogOpen.value = false
}

function cancelDelete(): void {
  deleteDialogOpen.value = false
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.removeEventListener('click', onDocumentClick)
})
</script>

<template>
  <li
    class="task-item"
    :class="[priorityClass(), { completed: task.completed, 'priority-dropdown-open': dropdownOpen }]"
    data-testid="task-item"
    @click="handleRowClick"
  >
    <input
      type="checkbox"
      :checked="task.completed"
      class="task-checkbox"
      readonly
      tabindex="-1"
    />
    <span class="task-text">{{ task.text }}</span>
    <div ref="priorityButtonRef" class="priority-wrap" @click.stop>
      <button
        type="button"
        class="priority-trigger"
        :aria-expanded="dropdownOpen"
        aria-haspopup="listbox"
        data-testid="task-priority-trigger"
        @click="openDropdown"
      >
        {{ task.priority }}
      </button>
      <ul
        v-show="dropdownOpen"
        class="priority-dropdown"
        role="listbox"
        aria-label="Выберите приоритет"
      >
        <li
          v-for="p in PRIORITIES"
          :key="p"
          role="option"
          :aria-selected="p === task.priority"
          class="priority-option"
          @click="selectPriority(p)"
        >
          {{ p }}
        </li>
      </ul>
    </div>
    <button
      type="button"
      class="task-delete-btn"
      aria-label="Удалить задачу"
      data-testid="task-delete-btn"
      @click="openDeleteDialog"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    </button>
    <Teleport to="body">
      <div
        v-if="deleteDialogOpen"
        class="delete-dialog-overlay"
        role="presentation"
        @click.self="cancelDelete"
      >
        <div
          ref="deleteDialogRef"
          class="delete-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <p id="delete-dialog-title" class="delete-dialog-message">
            Удалить задачу «{{ task.text }}»?
          </p>
          <div class="delete-dialog-actions">
            <button type="button" class="delete-dialog-cancel" @click="cancelDelete">
              Отмена
            </button>
            <button type="button" class="delete-dialog-confirm" @click="confirmDelete">
              Удалить
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </li>
</template>

<style scoped>
.task-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 0.25rem;
  cursor: pointer;
  list-style: none;
  position: relative;
  z-index: 0;
}

/* Выпадающий список приоритета поверх карточек ниже по списку */
.task-item.priority-dropdown-open {
  z-index: 100;
}

/* Еле уловимые цвета карточки по приоритету */
.task-item.priority-high {
  border-left: 3px solid #e57373;
  background-color: #ffebee;
}
.task-item.priority-medium {
  border-left: 3px solid #fff176;
  background-color: #fffde7;
}
.task-item.priority-low {
  border-left: 3px solid #90caf9;
  background-color: #e3f2fd;
}

.task-item:hover {
  filter: brightness(0.98);
}
.task-item.completed .task-text {
  text-decoration: line-through;
  color: #888;
}
.task-checkbox {
  cursor: pointer;
  width: 1.1rem;
  height: 1.1rem;
}
.task-text {
  flex: 1;
  min-width: 0;
}
.task-delete-btn {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
}
.task-delete-btn:hover {
  color: #c62828;
  background: #ffebee;
}
.delete-dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.delete-dialog {
  background: #fff;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 280px;
  max-width: 90vw;
}
.delete-dialog-message {
  margin: 0 0 1rem;
  font-size: 1rem;
}
.delete-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}
.delete-dialog-cancel,
.delete-dialog-confirm {
  padding: 0.4rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
}
.delete-dialog-cancel {
  border: 1px solid #ccc;
  background: #fff;
}
.delete-dialog-cancel:hover {
  background: #f5f5f5;
}
.delete-dialog-confirm {
  border: none;
  background: #c62828;
  color: #fff;
}
.delete-dialog-confirm:hover {
  background: #b71c1c;
}

.priority-wrap {
  position: relative;
}
.priority-trigger {
  cursor: pointer;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: #fff;
}
.priority-trigger:hover {
  background: #f5f5f5;
}
.priority-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin: 0.25rem 0 0;
  padding: 0.25rem 0;
  min-width: 6rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  list-style: none;
  z-index: 50;
}
.priority-option {
  padding: 0.35rem 0.75rem;
  cursor: pointer;
}
.priority-option:hover {
  background: #f0f0f0;
}
</style>
