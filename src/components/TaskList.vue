<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Task } from '@/types/task'
import type { TaskPriority } from '@/types/task'
import { useTodoStore } from '@/stores/todoStore'
import TaskItem from './TaskItem.vue'
import { VueDraggableNext } from 'vue-draggable-next'

const store = useTodoStore()

const hasTasks = computed(() => store.tasks.length > 0)

const highList = ref<Task[]>([...store.tasksByPriorityHigh])
const mediumList = ref<Task[]>([...store.tasksByPriorityMedium])
const lowList = ref<Task[]>([...store.tasksByPriorityLow])

function syncFromStore(): void {
  highList.value = [...store.tasksByPriorityHigh]
  mediumList.value = [...store.tasksByPriorityMedium]
  lowList.value = [...store.tasksByPriorityLow]
}

watch(
  () => [store.tasksByPriorityHigh, store.tasksByPriorityMedium, store.tasksByPriorityLow],
  () => syncFromStore(),
  { deep: true, flush: 'sync' }
)

function onDragEnd(priority: TaskPriority, ev: { oldIndex?: number; newIndex?: number }): void {
  const oldIndex = ev.oldIndex ?? 0
  const newIndex = ev.newIndex ?? 0
  store.reorderTasksInGroup(priority, oldIndex, newIndex)
  syncFromStore()
}
</script>

<template>
  <div class="task-list">
    <div v-if="!hasTasks" class="empty-state">
      Нет задач. Добавьте первую.
    </div>
    <template v-else>
      <section v-if="highList.length" class="priority-group">
        <VueDraggableNext
          v-model="highList"
          tag="ul"
          class="list"
          item-key="id"
          @end="(ev) => onDragEnd('High', ev)"
        >
          <TaskItem
            v-for="element in highList"
            :key="element.id"
            :task="element"
            @toggle="store.toggleTask(element.id)"
          />
        </VueDraggableNext>
      </section>
      <section v-if="mediumList.length" class="priority-group">
        <VueDraggableNext
          v-model="mediumList"
          tag="ul"
          class="list"
          item-key="id"
          @end="(ev) => onDragEnd('Medium', ev)"
        >
          <TaskItem
            v-for="element in mediumList"
            :key="element.id"
            :task="element"
            @toggle="store.toggleTask(element.id)"
          />
        </VueDraggableNext>
      </section>
      <section v-if="lowList.length" class="priority-group">
        <VueDraggableNext
          v-model="lowList"
          tag="ul"
          class="list"
          item-key="id"
          @end="(ev) => onDragEnd('Low', ev)"
        >
          <TaskItem
            v-for="element in lowList"
            :key="element.id"
            :task="element"
            @toggle="store.toggleTask(element.id)"
          />
        </VueDraggableNext>
      </section>
    </template>
  </div>
</template>

<style scoped>
.task-list {
  margin-top: 0.5rem;
}
.priority-group {
  margin-bottom: 0.25rem;
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
