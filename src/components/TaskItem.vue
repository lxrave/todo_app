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
    dropdownOpen.value = false
  }
}

function onDocumentClick(e: Event): void {
  if (!dropdownOpen.value) return
  const el = priorityButtonRef.value
  if (el && !el.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
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
