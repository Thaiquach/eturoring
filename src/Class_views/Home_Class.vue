<template>
  <div class="home-class">
    <h2>Tạo lớp học mới</h2>
    <form @submit.prevent="handleCreateOrUpdateClass">
      <!-- Thông tin lớp học -->
      <div>
        <label>Class Name:</label>
        <input v-model="classForm.className" type="text" required />
      </div>
      <div>
        <label>Chọn Tutor:</label>
        <multiselect v-model="selectedTutor" :options="tutors" :multiple="false" label="fullName" track-by="id"
          placeholder="Chọn Tutor"></multiselect>
      </div>
      <div>
        <label>Chọn Subject:</label>
        <multiselect v-model="selectedSubject" :options="subjects" :multiple="false" label="subjectName" track-by="id"
          placeholder="Chọn Subject"></multiselect>
      </div>
      <div>
        <label>Total Slot:</label>
        <input v-model.number="classForm.totalSlot" type="number" required />
      </div>
      <div>
        <label>Start Date:</label>
        <input v-model="classForm.startDate" type="date" required />
      </div>
      <div>
        <label>End Date:</label>
        <input v-model="classForm.endDate" type="date" required />
      </div>
      <div>
        <label>Description:</label>
        <textarea v-model="classForm.description"></textarea>
      </div>

      <!-- Chọn nhiều học sinh từ danh sách load về -->
      <div>
        <label>Chọn học sinh:</label>
        <multiselect v-model="selectedStudents" :options="students" :multiple="true" label="fullName" track-by="id"
          placeholder="Chọn học sinh">
          <!-- Hiển thị studentCode + fullName trong dropdown -->
          <template #option="{ option }">
            <div>
              <strong>{{ option.user.fullName }}</strong> -
              <small>{{ option.studentCode }}</small>
            </div>
          </template>

          <!-- Hiển thị khi đã chọn student -->
          <template #tag="{ option, remove }">
            <div class="multiselect__tag">
              {{ option.user.fullName }} ({{ option.studentCode }})
              <span @click.prevent="remove(option)">❌</span>
            </div>
          </template>

          <!-- Khi chỉ chọn 1 item -->
          <template #singleLabel="{ option }">
            <div>
              {{ option.user.fullName }} ({{ option.studentCode }})
            </div>
          </template>
        </multiselect>
      </div>

      <button type="submit" class="btn-save">
        {{ isEditMode ? "💾 Cập nhật lớp học" : "➕ Tạo lớp học" }}
      </button>
    </form>
  </div>
  <div class="class-list">
    <h3>📚 Danh sách lớp học</h3>
    <table class="class-table">
      <thead>
        <tr>
          <th>#</th>
          <th>ID</th> <!-- Thêm cột ID -->
          <th>Tên lớp</th>
          <th>Tutor</th>
          <th>Subject</th>
          <th>Slot</th>
          <th>Ngày bắt đầu</th>
          <th>Ngày kết thúc</th>
          <th>Mô tả</th>
          <th>Học sinh</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <!-- Vòng lặp để hiển thị danh sách lớp học -->
        <tr v-for="(classItem, index) in classes" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ classItem.id || 'N/A' }}</td> <!-- Hiển thị ID -->
          <td>{{ classItem.className || 'Không có tên lớp' }}</td>
          <td>{{ classItem.tutorName || 'Không có tutor' }}</td>
          <td>{{ classItem.subjectName || 'Không có môn học' }}</td>
          <td>{{ classItem.totalSlot || 0 }}</td>
          <!-- Hiển thị startDate và endDate từ backend -->
          <td>{{ formatDate(classItem.startDate) }}</td>
          <td>{{ formatDate(classItem.endDate) }}</td>
          <td>{{ classItem.description || 'Không có mô tả' }}</td>
          <td>
            <ul v-if="classItem.studentNames && classItem.studentNames.length > 0">
              <li v-for="(student, idx) in classItem.studentNames" :key="idx">
                {{ student }}
              </li>
            </ul>
            <span v-else>Không có học sinh</span>
          </td>
          <!-- ✅ Nút hành động để chỉnh sửa/xóa -->
          <td>
            <button @click="editClass(classItem)" class="btn-edit">✏️ Chỉnh sửa</button>
            <button @click="deleteClass(classItem.id)" class="btn-delete">🗑️ Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script>
import Multiselect from 'vue-multiselect';
import classService from '../api/classService';
import 'vue-multiselect/dist/vue-multiselect.css';

export default {
  name: 'Home_Class',
  components: { Multiselect },
  data() {
    return {
      isEditMode: false, // ✅ Trạng thái cập nhật hoặc thêm mới
      editClassId: null, // ✅ Lưu ID lớp cần cập nhật
      students: [],        // Danh sách học sinh
      tutors: [],          // Danh sách tutor
      subjects: [],        // Danh sách subject
      classes: [],         // Danh sách lớp học
      selectedTutor: null,
      selectedSubject: null,
      selectedStudents: [],
      // Form tạo lớp học mới
      classForm: {
        className: '',
        totalSlot: 0,
        startDate: '',
        endDate: '',
        description: ''
      },
    };
  },

  mounted() {
    this.loadStudents();
    this.loadTutors();
    this.loadSubjects();
    this.loadClasses(); // Load danh sách lớp học khi component được mount
  },
  methods: {
    async loadStudents() {
      try {
        const response = await classService.getAllStudents();
        console.log('Dữ liệu học sinh từ getAllStudents:', response.data);

        // Map lại dữ liệu với studentCode và fullName
        this.students = response.data
          .filter(student => student.id)
          .map(student => ({
            id: student.id,
            studentCode: student.studentCode,
            fullName: student.user?.fullName || 'Không xác định',
            user: student.user
          }));
      } catch (error) {
        console.error('Lỗi khi lấy danh sách học sinh:', error);
      }
    },
    async loadTutors() {
      try {
        const response = await classService.getAllTutors();
        console.log('Danh sách tutor:', response.data);
        // Gán danh sách tutor lấy từ API
        this.tutors = response.data.map(tutor => ({
          id: tutor.id,
          fullName: tutor.user?.fullName || 'Không xác định'
        }));
      } catch (error) {
        console.error('Lỗi khi lấy danh sách tutor:', error);
      }
    },
    async loadSubjects() {
      try {
        const response = await classService.getAllSubjects();
        console.log('Danh sách subject:', response.data);
        // Gán danh sách subject lấy từ API
        this.subjects = response.data.map(subject => ({
          id: subject.id,
          subjectName: subject.subjectName
        }));
      } catch (error) {
        console.error('Lỗi khi lấy danh sách subject:', error);
      }
    },
    async handleCreateOrUpdateClass() {
      try {
        // Kiểm tra nếu chưa chọn tutor hoặc subject
        if (!this.selectedTutor || !this.selectedSubject) {
          alert('Vui lòng chọn Tutor và Subject!');
          return;
        }
        // kiem tra trung lap
        const studentNames = [
          ...new Set(this.selectedStudents.map((student) => student.user.fullName)),
        ];

        // Đảm bảo dữ liệu đúng định dạng theo yêu cầu của backend
        const classData = {
          className: this.classForm.className,  // Tên lớp học
          tutorName: this.selectedTutor.fullName, // Tên Tutor được chọn
          subjectName: this.selectedSubject.subjectName, // Tên Subject được chọn
          totalSlot: Number(this.classForm.totalSlot), // Chuyển thành số nếu cần
          startDate: this.formatDateToISOString(this.classForm.startDate), // Chuyển đổi startDate sang ISO
          endDate: this.formatDateToISOString(this.classForm.endDate),
          description: this.classForm.description || '', // Mô tả lớp học
          studentNames: studentNames // Mảng các tên học sinh được chọn
        };

        // Log để kiểm tra payload trước khi gửi
        console.log("✅ Payload gửi lên:", classData);

        if (this.isEditMode) {
          await classService.updateClass(this.editClassId, classData);
          alert("✅ Lớp học đã được cập nhật thành công!");
        } else {
          await classService.createClass(classData);
          alert("🎉 Lớp học đã được tạo thành công!");
        }
        await this.loadClasses(); // Load lại danh sách lớp học
        // Reset form sau khi tạo thành công
        this.resetForm();
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          console.error("❌ Lỗi chi tiết từ backend:", error.response.data.errors);
          alert("⚠️ Dữ liệu không hợp lệ. Vui lòng kiểm tra lại!");
        } else {
          console.error("❌ Lỗi khi tạo lớp học:", error.message);
          alert("⚠️ Có lỗi xảy ra khi tạo lớp học!");
        }
      }
    },

    editClass(classItem) {
      this.editClassId = classItem.id || classItem.ClassId || classItem.ID;
      this.isEditMode = true;

      this.classForm = {
        className: classItem.className || "",
        totalSlot: classItem.totalSlot || 0,
        startDate: classItem.startDate ? classItem.startDate.split("T")[0] : "",
        endDate: classItem.endDate ? classItem.endDate.split("T")[0] : "",
        description: classItem.description || "",
      };

      this.selectedTutor = this.tutors.find(
        (tutor) => tutor.fullName === classItem.tutorName
      ) || null;

      this.selectedSubject = this.subjects.find(
        (subject) => subject.subjectName === classItem.subjectName
      ) || null;

      // ✅ So khớp học sinh theo studentIds
      this.selectedStudents = this.students.filter(student =>
        classItem.studentIds.includes(student.id)
      );

      console.log("👉 classItem.studentIds:", classItem.studentIds);
      console.log("✅ selectedStudents:", this.selectedStudents);
      console.log("✏️ Đang chỉnh sửa lớp học với ID:", this.editClassId);
    },
    cancelEdit() {
      this.resetForm();
    },

    async deleteClass(classId) {
      const confirmDelete = confirm("❗ Bạn có chắc chắn muốn xóa lớp học này không?");
      if (!confirmDelete) return;

      try {
        await classService.deleteClass(classId);
        alert("🗑️ Lớp học đã được xóa thành công!");
        await this.loadClasses(); // Load lại danh sách sau khi xóa
      } catch (error) {
        console.error("❌ Lỗi khi xóa lớp học:", error.response?.data || error.message);
        alert("⚠️ Có lỗi xảy ra khi xóa lớp học!");
      }
    },

    async loadClasses() {
      try {
        const response = await classService.getAllClasses(); // danh sacshs lớp học từ API
        console.log('Danh sách lớp học:', response.data);
        this.classes = response.data; // Gán dữ liệu vào biến classes
      } catch (error) {
        console.error('❌ Lỗi khi lấy danh sách lớp học:', error);
      }
    },

    formatDate(date) {
      // Kiểm tra nếu ngày tháng là mặc định, hiển thị "Chưa xác định"
      if (!date || date === '0001-01-01T00:00:00') {
        return 'Chưa xác định';
      }
      // Chuyển đổi ngày tháng thành định dạng dd/MM/yyyy
      const formattedDate = new Date(date);
      return formattedDate.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    },
    
    formatDateToISOString(date) {
      if (!date) {
        return null; // Trả về null nếu không có ngày
      }
      const formattedDate = new Date(date);
      return formattedDate.toISOString(); // Chuyển đổi sang định dạng ISO
    },

    resetForm() {
      this.classForm = {
        className: "",
        totalSlot: 0,
        startDate: "",
        endDate: "",
        description: "",
      };
      this.selectedTutor = null;
      this.selectedSubject = null;
      this.selectedStudents = [];
      this.isEditMode = false; // Quay về trạng thái tạo mới
      this.editClassId = null;
    },

  }
};
</script>

<style scoped>
/* Thêm CSS tùy chỉnh nếu cần */
.home-class {
  max-width: 600px;
  margin: 0 auto;
}

.home-class form>div {
  margin-bottom: 15px;
}

.class-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.class-table th,
.class-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: center;
}

.class-table th {
  background-color: #f2f2f2;
}

.class-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.class-table tbody tr:hover {
  background-color: #f1f1f1;
}

ul {
  list-style-type: none;
  /* Loại bỏ kiểu dấu đầu dòng */
  padding: 0;
  /* Xóa padding mặc định */
  margin: 0;
  /* Xóa margin mặc định */
}

li {
  padding: 5px 0;
  /* Thêm khoảng cách giữa các mục nếu cần */
}

.btn-save {
  background-color: #2196F3;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.btn-save:hover {
  background-color: #1e88e5;
}

.btn-cancel {
  background-color: #f44336;
  color: white;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  margin-left: 10px;
}

.btn-cancel:hover {
  background-color: #e53935;
}
</style>
