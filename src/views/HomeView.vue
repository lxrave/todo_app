<script setup lang="ts">
import TaskForm from '@/components/TaskForm.vue'
import TaskList from '@/components/TaskList.vue'
import { useTodoStore } from '@/stores/todoStore'

const store = useTodoStore()
</script>

<template>
  <div class="home">
    <h1>Задачи</h1>
    <TaskForm />
    <TaskList :tasks="store.sortedTasks" />
  </div>
</template>

<style scoped>
.home {
  max-width: 480px;
  margin: 0 auto;
  padding: 1rem;
}
h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
</style>
