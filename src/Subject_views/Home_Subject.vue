<template>
  <div class="create-container">
    
    <h2>{{ isEditing ? 'Update Subject' : 'Create New Subject' }}</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Subject Name</label>
        <input v-model="subjectName" required />
      </div>
      <div class="form-group">
        <label>Information</label>
        <textarea v-model="information" rows="4"></textarea>
      </div>
      <button type="submit">{{ isEditing ? 'Update' : 'Create Subject' }}</button>
      <button v-if="isEditing" type="button" @click="cancelEdit">Hủy</button>
      <p v-if="message" class="message">{{ message }}</p>
    </form>

    <!-- Danh sách subjects ngay dưới form -->
    <h3>All Subjects</h3>
    <table class="data-table">
      <thead>
        <tr>
          <th>Subject Name</th>
          <th>Information</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="sub in subjects" :key="sub.id">
          <td>{{ sub.subjectName }}</td>
          <td>{{ sub.information }}</td>
          <td>
            <button @click="editSubject(sub)">Sửa</button>
            <button @click="deleteSubject(sub.id)">Xóa</button>
          </td>
        </tr>
        <tr v-if="subjects.length === 0">
          <td colspan="3" class="no-data">No subjects found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import subjectService from '../api/subjectService.js'
import TopBar from '../components/TopBar.vue'    // ← import TopBar
import SideBar from '../components/SideBar.vue'

const subjectName = ref('')
const information = ref('')
const message = ref('')
const subjects = ref([])
const isEditing = ref(false)
const editingId = ref(null)

async function loadSubjects() {
  try {
    const { data } = await subjectService.getSubjects()
    subjects.value = data
  } catch (err) {
    console.error('Load subjects failed', err)
  }
}

async function handleSubmit() {
  message.value = ''
  try {
    if (isEditing.value) {
      // Update subject
      const { data } = await subjectService.updateSubject(editingId.value, {
        subjectName: subjectName.value,
        information: information.value
      })
      message.value = data.message

      // Update local list
      const index = subjects.value.findIndex(sub => sub.id === editingId.value)
      if (index !== -1) {
        subjects.value[index].subjectName = subjectName.value
        subjects.value[index].information = information.value
      }

      isEditing.value = false
      editingId.value = null
    } else {
      // Create subject
      const { data } = await subjectService.createSubject({
        subjectName: subjectName.value,
        information: information.value
      })
      subjects.value.push(data.subjectDto)
      message.value = data.message
    }

    // Reset form
    subjectName.value = ''
    information.value = ''
  } catch (err) {
    message.value = err.response?.data?.message || 'Action failed'
  }
}

async function editSubject(subject) {
  isEditing.value = true
  editingId.value = subject.id
  subjectName.value = subject.subjectName
  information.value = subject.information
}
onMounted(loadSubjects)

async function deleteSubject(id) {
  const confirmDelete = confirm('Bạn có chắc muốn xóa subject này?')
  if (!confirmDelete) return

  try {
    await subjectService.deleteSubject(id)
    // Xóa khỏi danh sách hiển thị
    subjects.value = subjects.value.filter(sub => sub.id !== id)
    message.value = 'Subject deleted successfully.'
  } catch (err) {
    console.error('Delete failed', err)
    message.value = err.response?.data?.message || 'Failed to delete subject.'
  }
}


function cancelEdit() {
  isEditing.value = false
  subjectName.value = ''
  information.value = ''
  editingId.value = null
  message.value = ''
}
</script>


<style scoped>
.create-container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: .5rem;
  font-weight: 600;
}

input,
textarea {
  width: 100%;
  padding: .75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-top: 1rem;
  padding: .75rem 1.5rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.message {
  margin-top: 1rem;
  color: #155724;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
}

.data-table th,
.data-table td {
  border: 1px solid #ccc;
  padding: .5rem;
}

.no-data {
  text-align: center;
  font-style: italic;
  color: #777;
}

button[type="button"] {
  background: #dc3545;
  /* đỏ */
  margin-left: 1rem;
}

button:nth-child(2) {
  background: #dc3545; /* đỏ */
  margin-left: 0.5rem;
}
</style>