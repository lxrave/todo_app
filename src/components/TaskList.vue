<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Task } from '@/types/task'
import { useTodoStore } from '@/stores/todoStore'
import TaskItem from './TaskItem.vue'
import { VueDraggableNext } from 'vue-draggable-next'

const props = defineProps<{
  tasks: Task[]
}>()

const store = useTodoStore()
const list = ref<Task[]>([...props.tasks])

watch(
  () => props.tasks,
  (tasks) => {
    list.value = [...tasks]
  },
  { deep: true, flush: 'sync', immediate: true }
)

function onDragEnd(ev: { oldIndex?: number; newIndex?: number }): void {
  const oldIndex = ev.oldIndex ?? 0
  const newIndex = ev.newIndex ?? 0
  store.reorderTasks(oldIndex, newIndex)
  list.value = [...store.sortedTasks]
}
</script>

<template>
  <div class="task-list">
    <div v-if="tasks.length === 0" class="empty-state">
      Нет задач. Добавьте первую.
    </div>
    <VueDraggableNext
      v-else
      v-model="list"
      tag="ul"
      class="list"
      item-key="id"
      @end="onDragEnd"
    >
      <TaskItem
        v-for="element in list"
        :key="element.id"
        :task="element"
        @toggle="store.toggleTask(element.id)"
      />
    </VueDraggableNext>
  </div>
</template>

<style scoped>
.task-list {
  margin-top: 0.5rem;
}
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.empty-state {
  color: #666;
  padding: 1.5rem;
  text-align: center;
}
</style>
