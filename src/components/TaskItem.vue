<script setup lang="ts">
import type { Task } from '@/types/task'

defineProps<{
  task: Task
}>()

const emit = defineEmits<{
  toggle: []
}>()

function handleClick(): void {
  emit('toggle')
}
</script>

<template>
  <li
    class="task-item"
    :class="{ completed: task.completed }"
    @click="handleClick"
  >
    <input
      type="checkbox"
      :checked="task.completed"
      class="task-checkbox"
      readonly
      tabindex="-1"
    />
    <span class="task-text">{{ task.text }}</span>
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
}
.task-item:hover {
  background: #f5f5f5;
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
</style>
