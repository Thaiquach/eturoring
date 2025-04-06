<template>
    <div class="classroom-container">
        <SideBar />
        <h2>🏫 Tạo phòng học mới</h2>
        <form @submit.prevent="handleCreateClassroom">
            <label for="name">Tên phòng học:</label>
            <input v-model="newClassroomName" id="name" type="text" required />
            <button type="submit">➕ Tạo phòng học</button>
        </form>

        <h3>📋 Danh sách phòng học</h3>
        <form class="room-list-form">
            <ul class="room-list">
                <li v-for="(room, index) in classrooms" :key="room.id" class="room-item">
                    <span> {{ index + 1 }}. {{ room.name }}</span>
                    <button @click.prevent="handleDeleteRoom(room.id)" class="delete-btn">🗑 Xoá</button>
                </li>
            </ul>
        </form>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import classroomService from '../api/classroomService'; // ✅ Đảm bảo đúng đường dẫn
import SideBar from '../components/SideBar.vue';

const newClassroomName = ref('');
const createdClassroom = ref(null);
const classrooms = ref([]); // ✅ Danh sách phòng học

// 🔄 Gọi API lấy danh sách phòng học
const loadClassrooms = async () => {
    try {
        const res = await classroomService.getAllClassrooms();
        console.log("📦 Dữ liệu phòng học từ API:", res.data); // 🧾 Log dữ liệu ra console
        classrooms.value = res.data;
    } catch (err) {
        console.error("❌ Lỗi khi tải danh sách phòng học:", err);
    }
};

// 🧾 Hàm tạo phòng học mới
const handleCreateClassroom = async () => {
    try {
        const payload = { name: newClassroomName.value };
        const response = await classroomService.createClassroom(payload);
        createdClassroom.value = response.data;
        newClassroomName.value = ''; // ✅ Reset input
        await loadClassrooms();      // ✅ Cập nhật lại danh sách
        alert("✅ Tạo phòng học thành công!");
    } catch (err) {
        console.error("❌ Lỗi tạo Classroom:", err);
        alert("❌ Không thể tạo phòng học. Kiểm tra lại!");
    }
};

const handleDeleteRoom = async (roomId) => {
  if (!confirm(`Bạn có chắc chắn muốn xoá phòng học này?`)) return;
  try {
    await classroomService.deleteClassroomById(roomId);
    await loadClassrooms();
    alert("🗑 Đã xoá phòng học!");
  } catch (err) {
    console.error("❌ Lỗi xoá phòng học:", err);
    alert("❌ Không thể xoá phòng học. Kiểm tra lại!");
  }
};



// 🔃 Load danh sách phòng học khi component được mount
onMounted(() => {
    loadClassrooms();
});
</script>


<style scoped>
.classroom-container {
    max-width: 600px;
    margin: auto;
    padding: 20px;
}

input {
    padding: 8px;
    width: 100%;
    margin: 10px 0;
}

button {
    padding: 6px 12px;
    background-color: #4caf50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
}

button:hover {
    background-color: #45a049;
}

.room-list-form {
    margin-top: 20px;
}

.room-list {
    list-style: none;
    padding: 0;
}

.room-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #ccc;
}

.delete-btn {
    background-color: #f44336;
    border: none;
    color: white;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
}

.delete-btn:hover {
    background-color: #d32f2f;
}
</style>
