<template>
  <form @submit.prevent="handleCreate">
    <input v-model="title" placeholder="Title" required />
    <input v-model.number="price" type="number" placeholder="Price" required />
    <textarea v-model="description" placeholder="Description"></textarea>
    <button type="submit">Create</button>
  </form>

  <table class="data-table">
    <thead>
      <tr><th>ID</th><th>Title</th><th>Price</th><th>Description</th><th>Edit</th><th>Delete</th></tr>
    </thead>
    <tbody>
      <tr v-for="c in classes" :key="c.id">
        <template v-if="editingId === c.id">
          <td>{{ c.id }}</td>
          <td><input v-model="edited.title" /></td>
          <td><input type="number" v-model.number="edited.price" /></td>
          <td><input v-model="edited.description" /></td>
          <td><button @click="saveEdit">Save</button></td>
          <td><button @click="cancelEdit">Cancel</button></td>
        </template>
        <template v-else>
          <td>{{ c.id }}</td>
          <td>{{ c.title }}</td>
          <td>{{ c.price }}</td>
          <td>{{ c.description }}</td>
          <td><button @click="editClass(c)">Edit</button></td>
          <td><button @click="deleteClass(c.id)">Delete</button></td>
        </template>
      </tr>
      <tr v-if="classes.length === 0">
        <td colspan="6" class="no-data">No classes found</td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import classService from '../api/classService.js'

const classes = ref([])
const title = ref('')
const price = ref(null)
const description = ref('')
const editingId = ref(null)
const edited = reactive({ title: '', price: 0, description: '' })

async function loadClasses() {
  const res = await classService.getClasses()
  classes.value = res.data.products
}
onMounted(loadClasses)

async function handleCreate() {
  const payload = { title: title.value, price: price.value, description: description.value }
  const res = await classService.createClass(payload)
  classes.value.push(res.data)
  title.value = ''
  price.value = null
  description.value = ''
}

function editClass(cls) {
  editingId.value = cls.id
  edited.title = cls.title
  edited.price = cls.price
  edited.description = cls.description
}

async function saveEdit() {
  const res = await classService.updateClass(editingId.value, {
    title: edited.title,
    price: edited.price,
    description: edited.description
  })
  const idx = classes.value.findIndex(c => c.id === editingId.value)
  classes.value[idx] = res.data
  editingId.value = null
}

function cancelEdit() {
  editingId.value = null
}

async function deleteClass(id) {
  await classService.deleteClass(id)
  classes.value = classes.value.filter(c => c.id !== id)
}
</script>

<style scoped>
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.data-table th,
.data-table td {
  border: 1px solid #ccc;
  padding: 8px;
}
.no-data {
  text-align: center;
  font-style: italic;
  color: #777;
}
button {
  padding: 4px 8px;
  cursor: pointer;
}
</style>
