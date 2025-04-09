<template>
  <div class="schedule-form">
    <h2>🗕️ Tạo lịch học</h2>
    <form @submit.prevent="handleCreate">
      <label>Chọn lớp học:</label>
      <select v-model="form.classId" required>
        <option v-for="cls in classes" :key="cls.id" :value="cls.id">
          {{ cls.className }}
        </option>
      </select>

      <label>Thứ (0=CN - 6=Thứ 7):</label>
      <input type="number" v-model.number="form.day" min="0" max="6" required />

      <div v-if="!isRecurring">
        <label>Ngày học:</label>
        <input v-model="form.scheduleDate" type="date" required />
        <p v-if="isDateMismatch" style="color: red">
          ⚠️ Ngày không khớp với thứ đã chọn!
        </p>
      </div>

      <p v-if="isRecurring && selectedClassDates" style="font-style: italic">
        🗕️ Ngày học sẽ được tự động tính từ ngày bắt đầu đến ngày kết thúc của lớp học. Nếu vẫn muốn tạo mới thì ngày
        bắt đầu sẽ được từ động lùi để phù hợp với với thứ đã chọnchọn

        <strong>{{ selectedClassDates.start }}</strong> đến
        <strong>{{ selectedClassDates.end }}</strong> của lớp học.
      </p>

      <div v-if="isRecurring && form.scheduleDate">
        <label>Ngày bắt đầu thực tế:</label>
        <input type="date" :value="form.scheduleDate" disabled />
      </div>

      <p v-if="isStartDateMismatch" style="color: orange; font-style: italic">
        ⚠️ Ngày bắt đầu của lớp không trùng thứ bạn chọn.
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
        <option v-for="room in classrooms" :key="room.id" :value="room.id">
          {{ room.name }}
        </option>
      </select>

      <label>
        <input type="checkbox" v-model="isRecurring" />
        🔁 Tạo lặp mỗi tuần
      </label>

      <button type="submit">
        {{ isEditing ? '📏 Cập nhật lịch học' : '➕ Tạo lịch học' }}
      </button>
      <div v-if="isEditing">
        <button type="button" @click="cancelEdit">❌ Huỷ cập nhật</button>
      </div>
    </form>
  </div>

  <div class="schedule-list">
    <h2>🗕️ Danh sách lịch học</h2>
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
  classroomId: null
});
const isRecurring = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const schedules = ref([]);
const classes = ref([]);
const classrooms = ref([]);

const getSlotTime = (slot) => {
  const slots = {
    1: '08:00 - 09:30',
    2: '09:30 - 11:00',
    3: '14:00 - 15:30',
    4: '15:30 - 17:00'
  };
  return slots[slot] || 'Unknown Slot';
};

const handleCreate = async () => {
  try {
    const payload = { ...form.value };
    payload.day = parseInt(form.value.day); // ✨ Fix: DayOfWeek backend
    if (isEditing.value && editingId.value) {
      await scheduleService.updateSchedule(editingId.value, payload);
      alert('✅ Đã cập nhật lịch học!');
    } else {
      if (isRecurring.value) {
        payload.scheduleDate = new Date(form.value.scheduleDate).toISOString();
        console.log('📤 Payload lặp:', payload);
        await scheduleService.createRecurringSchedule(payload);
        alert('✅ Đã tạo lịch lặp lại!');
      } else {
        payload.scheduleDate = new Date(form.value.scheduleDate).toISOString();
        await scheduleService.createSchedule(payload);
        alert('✅ Đã tạo lịch học!');
      }
    }
    await loadSchedules();
    cancelEdit();
  } catch (err) {
    console.error('❌ Lỗi:', err);
    alert('❌ Thao tác thất bại!');
  }
};

function getNearestDateByDay(startDateStr, targetDay) {
  if (!startDateStr) return '';

  const [year, month, day] = startDateStr.slice(0, 10).split('-').map(Number);
  const date = new Date(year, month - 1, day);

  const currentDay = date.getDay();
  let diff = (targetDay - currentDay + 7) % 7;

  // ⚡️ Đây là thay đổi QUAN TRỌNG: không được cho diff = 0 là +7 => giữ nguyên nếu không cần trùng tuần sau
  const adjustedDate = new Date(date);
  adjustedDate.setDate(date.getDate() + diff);

  const yyyy = adjustedDate.getFullYear();
  const mm = (adjustedDate.getMonth() + 1).toString().padStart(2, '0');
  const dd = adjustedDate.getDate().toString().padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}


const resetForm = () => {
  form.value = {
    day: 1,
    slot: 1,
    linkMeeting: '',
    scheduleDate: '',
    classId: classes.value[0]?.id ?? null,
    classroomId: null,
  };
  isEditing.value = false;
  editingId.value = null;
  isRecurring.value = false;
};

const cancelEdit = () => {
  form.value = {
    day: 1,
    slot: 1,
    linkMeeting: '',
    scheduleDate: '',
    classId: classes.value[0]?.id ?? null,
    classroomId: null
  };
  isEditing.value = false;
  editingId.value = null;
  isRecurring.value = false;
};

const handleEdit = (schedule) => {
  form.value = {
    day: schedule.day,
    slot: schedule.slot,
    linkMeeting: schedule.linkMeeting,
    scheduleDate: schedule.scheduleDate?.slice(0, 10),
    classId: schedule.classId,
    classroomId: schedule.classroomId
  };
  isEditing.value = true;
  editingId.value = schedule.id;
  isRecurring.value = false;
};

const handleDelete = async (id) => {
  const confirmDelete = confirm('❗Bạn có chắc chắn muốn xoá lịch học này?');
  if (!confirmDelete) return;
  try {
    await scheduleService.deleteSchedule(id);
    alert('🗑️ Đã xoá lịch học thành công!');
    await loadSchedules();
  } catch (err) {
    console.error('❌ Lỗi xoá lịch học:', err);
    alert('❌ Xoá lịch học thất bại!');
  }
};

const isDateMismatch = computed(() => {
  if (!form.value.scheduleDate || isRecurring.value) return false;
  const selectedDate = new Date(form.value.scheduleDate);
  return selectedDate.getDay() !== form.value.day;
});

const isStartDateMismatch = computed(() => {
  if (!form.value.classId || !isRecurring.value) return false;
  const selectedClass = classes.value.find(cls => cls.id === form.value.classId);
  if (!selectedClass) return false;
  const start = new Date(selectedClass.startDate);
  return start.getDay() !== form.value.day;
});

const getDayLabel = (day) => ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][day] || 'Không rõ';
const getClassName = (id) => classes.value.find(c => c.id === id)?.className || 'Không rõ';
const getRoomName = (id) => classrooms.value.find(r => r.id === id)?.name || 'Không rõ';
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('vi-VN');

const loadSchedules = async () => {
  try {
    const res = await scheduleService.getAllSchedules();
    schedules.value = res.data;
  } catch (err) {
    console.error('❌ Lỗi khi tải lịch học:', err);
  }
};

const loadClassesAndRooms = async () => {
  const classRes = await classService.getAllClasses();
  const roomRes = await classroomService.getAllClassrooms();
  classes.value = classRes.data;
  classrooms.value = roomRes.data;
};

const selectedClassDates = computed(() => {
  if (!form.value.classId || !isRecurring.value) return null;
  const selectedClass = classes.value.find(cls => cls.id === form.value.classId);
  if (!selectedClass) return null;

  const start = new Date(selectedClass.startDate).toLocaleDateString("vi-VN");
  const end = new Date(selectedClass.endDate).toLocaleDateString("vi-VN");
  return { start, end };
});


onMounted(async () => {
  await loadSchedules();
  await loadClassesAndRooms();
});

watch([() => form.value.day, () => form.value.classId], ([newDay, newClassId]) => {
  if (isRecurring.value && newClassId !== null) {
    const selectedClass = classes.value.find(cls => cls.id === newClassId);
    if (selectedClass && selectedClass.startDate) {
      const iso = selectedClass.startDate.slice(0, 10);
      const adjustedDate = getNearestDateByDay(iso, newDay);
      form.value.scheduleDate = adjustedDate;
      console.log("📅 Đã tính ngày bắt đầu thực tế:", adjustedDate);
    }
  }
});



</script>

<style scoped>
.schedule-form {
  margin-bottom: 2rem;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
}

.schedule-table th,
.schedule-table td {
  border: 1px solid #ddd;
  padding: 8px;
}

.schedule-table th {
  background-color: #f2f2f2;
}
</style>
