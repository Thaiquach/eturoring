<template>
    <div class="schedule-form">
        <h2>📅 Tạo lịch học</h2>
        <form @submit.prevent="handleCreate">
            <label>Chọn lớp học:</label>
            <select v-model="form.classId" required>
                <option v-for="cls in classes" :key="cls.id" :value="cls.id">{{ cls.className }}</option>
            </select>

            <label>Thứ (0=CN - 6=Thứ 7):</label>
            <input type="number" v-model.number="form.day" min="0" max="6" required />

            <div v-if="!isRecurring">
                <label>Ngày học:</label>
                <input v-model="form.scheduleDate" type="date" required />
                <p v-if="isDateMismatch" style="color: red;">⚠️ Ngày không khớp với thứ đã chọn!</p>
            </div>

            <p v-if="isRecurring" style="font-style: italic">
                📅 Ngày học sẽ được tự động tính từ ngày bắt đầu đến ngày kết thúc của lớp học.
            </p>

            <label for="slot">🕒 Chọn ca học:</label>
            <select v-model="form.slot" id="slot" required>
                <option :value="1">Slot 1</option>
                <option :value="2">Slot 2</option>
                <option :value="3">Slot 3</option>
                <option :value="4">Slot 4</option>
            </select>
            <p><strong>Khung giờ:</strong> {{ getSlotTime(form.slot) }}</p>


            <label>Link học:</label>
            <input v-model="form.linkMeeting" required />

            <label>Phòng học:</label>
            <select v-model="form.classroomId" required>
                <option v-for="room in classrooms" :key="room.id" :value="room.id">{{ room.name }}</option>
            </select>

            <label>
                <input type="checkbox" v-model="isRecurring" />
                🔁 Tạo lặp mỗi tuần
            </label>

            <button type="submit">➕ Tạo lịch học</button>
        </form>
    </div>
    <div class="schedule-list">
        <h2>📅 Danh sách lịch học</h2>

        <table class="schedule-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Ngày học</th>
                    <th>Thứ</th>
                    <th>Ca học</th>
                    <th>Giờ học</th>
                    <th>Link học</th>
                    <th>Lớp</th>
                    <th>Phòng</th>
                    <th>Hành động</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(schedule, index) in schedules" :key="schedule.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ formatDate(schedule.scheduleDate) }}</td>
                    <td>{{ getDayLabel(schedule.day) }}</td>
                    <td>Slot {{ schedule.slot }}</td>
                    <td>{{ getSlotTime(schedule.slot) }}</td>
                    <td><a :href="schedule.linkMeeting" target="_blank">🔗 Link</a></td>
                    <td>{{ getClassName(schedule.classId) }}</td>
                    <td>{{ getRoomName(schedule.classroomId) }}</td>
                    <td>
                        <!-- Bạn sẽ thêm chức năng sửa/xoá ở đây sau -->
                        <button @click="handleEdit(schedule)">✏️ Sửa</button>
                        <button @click="handleDelete(schedule.id)">🗑 Xoá</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import scheduleService from '../api/scheduleService';
import classService from '../api/classService';
import classroomService from '../api/classroomService';




const form = ref({
    day: 1,
    slot: 1,
    linkMeeting: '',
    scheduleDate: '',
    classId: null,
    classroomId: null,
});
const isRecurring = ref(false);
const schedules = ref([]);
const classes = ref([]);
const classrooms = ref([]);

watch(() => form.value.classId, (newClassId) => {
    const selectedClass = classes.value.find(cls => cls.id === newClassId);
    if (selectedClass) {
        console.log("📘 Lớp được chọn:", selectedClass);
        console.log("⏳ StartDate:", selectedClass.startDate);
        console.log("⏳ EndDate:", selectedClass.endDate);
    } else {
        console.warn("⚠️ Không tìm thấy lớp học với ID:", newClassId);
    }
});
const getSlotTime = (slot) => {
    const slots = {
        1: "08:00 - 09:30",
        2: "09:30 - 11:00",
        3: "14:00 - 15:30",
        4: "15:30 - 17:00",
    };
    return slots[slot] || "Unknown Slot";
};

// 🧠 Gọi API tạo lịch
const handleCreate = async () => {
    try {
        const payload = { ...form.value };
        if (isRecurring.value) {
            const selectedClass = classes.value.find(cls => cls.id === form.value.classId);
            if (!selectedClass) {
                alert("Không tìm thấy lớp học đã chọn!");
                return;
            }

            // ✅ Sử dụng startDate làm scheduleDate duy nhất
            payload.scheduleDate = new Date(selectedClass.startDate).toISOString();
        }
        console.log("📦 Payload gửi lên:", payload);

        if (isRecurring.value) {
            delete payload.scheduleDate;
            await scheduleService.createRecurringSchedule(payload);
            alert("✅ Đã tạo lịch lặp lại!");
        } else {
            await scheduleService.createSchedule(payload);
            alert("✅ Đã tạo lịch học!");
        }
        // 🔄 Reset form
        form.value = {
            day: 1,
            slot: 1,
            linkMeeting: '',
            scheduleDate: '',
            classId: classes.value[0]?.id ?? null,
            classroomId: null,
        };
        isRecurring.value = false;
    } catch (err) {
        console.error("❌ Lỗi tạo lịch:", err);
        alert("❌ Lỗi khi tạo lịch học!");
    }

};
const getDayLabel = (day) => {
    const days = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    return days[day] || "Không rõ";
};

const getClassName = (id) => {
    const cls = classes.value.find(c => c.id === id);
    return cls ? cls.className : "Không rõ";
};

const getRoomName = (id) => {
    const r = classrooms.value.find(r => r.id === id);
    return r ? r.name : "Không rõ";
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
};

const loadSchedules = async () => {
    try {
        const res = await scheduleService.getAllSchedules();
        schedules.value = res.data;
        console.log("📋 Danh sách lịch học đã tải:", schedules.value);
    } catch (err) {
        console.error("❌ Lỗi khi tải lịch học:", err);
    }
};

const loadClassesAndRooms = async () => {
    const classRes = await classService.getAllClasses();
    const roomRes = await classroomService.getAllClassrooms();
    classes.value = classRes.data;
    classrooms.value = roomRes.data;
};

const isDateMismatch = computed(() => {
    if (!form.value.scheduleDate || isRecurring.value) return false;
    const selectedDate = new Date(form.value.scheduleDate);
    return selectedDate.getDay() !== form.value.day;
});


// Load dữ liệu lớp học & phòng học
onMounted(async () => {
    await loadSchedules();
    await loadClassesAndRooms();
});
</script>