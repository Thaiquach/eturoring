<script setup>
import { ref, onMounted } from 'vue'
import classService from '../api/classService.js'

const classes = ref([])
const title = ref('')
const price = ref(0)
const description = ref('')

onMounted(loadClasses)

async function loadClasses() {
  const res = await classService.getClasses()
  // dummyjson trả về res.data.products
  classes.value = res.data.products.map(normalize)
}

async function handleCreate() {
  try {
    const payload = { title: title.value, price: price.value, description: description.value }
    const res = await classService.createClass(payload)
    // normalize response rồi thêm vào mảng
    classes.value.push(normalize(res.data))
    // reset form
    title.value = ''
    price.value = 0
    description.value = ''
  } catch (err) {
    console.error(err)
  }
}

// Hàm map chung cho cả hai API
function normalize(item) {
  return {
    id: item.id,
    title: item.title,
    price: item.price,
    description: item.description || item.description // nếu khác key thì đổi ở đây
  }
}
</script>

<template>
  <form @submit.prevent="handleCreate">
    <input v-model="title" placeholder="Title" required />
    <input v-model.number="price" type="number" placeholder="Price" required />
    <textarea v-model="description" placeholder="Description" />
    <button type="submit">Create</button>
  </form>

  <table>
    <thead><tr><th>ID</th><th>Title</th><th>Price</th><th>Description</th></tr></thead>
    <tbody>
      <tr v-for="c in classes" :key="c.id">
        <td>{{ c.id }}</td>
        <td>{{ c.title }}</td>
        <td>{{ c.price }}</td>
        <td>{{ c.description }}</td>
      </tr>
    </tbody>
  </table>
</template>
