<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTodoStore } from '@/stores/todoStore'

const store = useTodoStore()
const inputText = ref('')

const canSubmit = computed(() => inputText.value.trim() !== '')

function submit(): void {
  const trimmed = inputText.value.trim()
  if (trimmed === '') return
  store.addTask(trimmed)
  inputText.value = ''
}
</script>

<template>
  <form class="task-form" @submit.prevent="submit">
    <input
      v-model="inputText"
      type="text"
      class="task-input"
      placeholder="Текст задачи"
      autocomplete="off"
    />
    <button type="submit" class="btn-add" :disabled="!canSubmit">
      Добавить
    </button>
  </form>
</template>

<style scoped>
.task-form {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.task-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
.task-input:focus {
  outline: none;
  border-color: #42b883;
}
.btn-add {
  padding: 0.5rem 1rem;
  background: #42b883;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}
.btn-add:hover:not(:disabled) {
  background: #359268;
}
.btn-add:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
