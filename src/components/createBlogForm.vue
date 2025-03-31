<template>
  <div class="form-overlay">
    <form @submit.prevent="submitForm" class="form-container">
      <h3>{{ id ? 'Edit Blog' : 'Add New Blog' }}</h3>

      <!-- Tiêu đề Blog -->
      <label>Title</label>
      <input v-model="title" type="text" required />

      <!-- Nội dung Blog -->
      <label>Content</label>
      <textarea v-model="content" required></textarea>

      <!-- Upload ảnh -->
      <label>Upload Image</label>
      <input type="file" @change="handleFileUpload" accept="image/*,application/pdf,.doc,.docx" />


      <button type="submit">{{ id ? 'Update Blog' : 'Add Blog' }}</button>
      <button type="button" @click="$emit('close')" class="cancel-btn">Cancel</button>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import blogService from '../api/blogService';

const props = defineProps(['editingBlog']);
const emit = defineEmits(['blogUpdated', 'close']);

const id = ref(null);
const title = ref('');
const content = ref('');
const file = ref(null); // Lưu file ảnh được upload

// ✅ Theo dõi thay đổi khi edit blog
watch(
  () => props.editingBlog,
  (newVal) => {
    if (newVal) {
      id.value = newVal.id;
      title.value = newVal.title || '';
      content.value = newVal.content || '';
    }
  },
  { deep: true, immediate: true }
);


// ✅ Xử lý khi chọn file ảnh
const handleFileUpload = (event) => {
  file.value = event.target.files[0];
};

// ✅ Xử lý submit form (Add/Update)
const submitForm = async () => {
  try {
    const formData = new FormData();
    formData.append('title', title.value);
    formData.append('content', content.value);
    if (file.value) {
      formData.append('file', file.value);
    }

    let updatedBlog = null;

    if (id.value) {
      updatedBlog = await blogService.updateBlog(id.value, formData);
    } else {
      updatedBlog = await blogService.createBlog(formData);
    }

    if (updatedBlog) {
      emit('blogUpdated', updatedBlog);
      resetForm();
    }
  } catch (error) {
    console.error('❗️ Error during blog creation/update:', error);
  }
};
// ✅ Reset form sau khi thêm/cập nhật
const resetForm = () => {
  id.value = null;
  title.value = '';
  content.value = '';
  file.value = null;
  emit('close');
};
</script>

<style scoped>
.form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}

label {
  font-weight: bold;
  margin-top: 8px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 8px;
  background-color: #4caf50;
  color: white;
  border: none;
  margin-top: 8px;
  border-radius: 6px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f44336;
}
</style>
