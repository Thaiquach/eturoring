<template>
  <adminLayout>
    <div class="home-class">
    <h2>New Class</h2>
    <form @submit.prevent="handleCreateOrUpdateClass">
      <!-- Thông tin lớp học -->
      <div>
        <label>Class Name:</label>
        <input v-model="classForm.className" type="text" required />
      </div>
      <div>
        <label>Add Tutor:</label>
        <multiselect v-model="selectedTutor" :options="tutors" :multiple="false" label="fullName" track-by="id"
          placeholder="Add Tutor"></multiselect>
      </div>
      <div>
        <label>Add Subject:</label>
        <multiselect v-model="selectedSubject" :options="subjects" :multiple="false" label="subjectName" track-by="id"
          placeholder="Add Subject"></multiselect>
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
        <label>Add multiple students:</label>
        <multiselect v-model="selectedStudents" :options="students" :multiple="true" label="fullName" track-by="id"
          placeholder="Select student">
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
        {{ isEditMode ? "💾 Update" : "➕ Add New" }}
      </button>
    </form>
  </div>
  <div class="class-list">
    <h3>📚 LIST CLASS</h3>
    <table class="class-table">
      <thead>
        <tr>
          <th>#</th>
          <th>ID</th> <!-- Thêm cột ID -->
          <th>Class Name</th>
          <th>Tutor</th>
          <th>Subject</th>
          <th>Slot</th>
          <th>Start Date</th>
          <th>End Date</th>
          <th>Description</th>
          <th>Students</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <!-- Vòng lặp để hiển thị danh sách lớp học -->
        <tr v-for="(classItem, index) in classes" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ classItem.id || 'N/A' }}</td> <!-- Hiển thị ID -->
          <td>{{ classItem.className || 'Has no class name' }}</td>
          <td>{{ classItem.tutorName || 'Has no tutor' }}</td>
          <td>{{ classItem.subjectName || 'Has no subject' }}</td>
          <td>{{ classItem.totalSlot || 0 }}</td>
          <!-- Hiển thị startDate và endDate từ backend -->
          <td>{{ formatDate(classItem.startDate) }}</td>
          <td>{{ formatDate(classItem.endDate) }}</td>
          <td>{{ classItem.description || 'No description' }}</td>
          <td>
            <ul v-if="classItem.studentNames && classItem.studentNames.length > 0">
              <li v-for="(student, idx) in classItem.studentNames" :key="idx">
                {{ student }}
              </li>
            </ul>
            <span v-else>Empty student</span>
          </td>
          <!-- ✅ Nút hành động để chỉnh sửa/xóa -->
          <td>
            <button @click="editClass(classItem)" class="btn-edit">✏️ Update</button>
            <button @click="deleteClass(classItem.id)" class="btn-delete">🗑️ Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  </adminLayout>
  
</template>

<script>
import Multiselect from 'vue-multiselect';
import classService from '../api/classService';
import 'vue-multiselect/dist/vue-multiselect.css';
import adminLayout from '../components/adminLayout.vue';

export default {
  name: 'Home_Class',
  components: { Multiselect,adminLayout },
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
.home-class {
  max-width: 800px;
  margin: 20px auto;
  background: #e3f2fd;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.1);
  transition: all 0.3s ease;
}

.home-class h2 {
  color: #0d47a1;
  margin-bottom: 24px;
  text-align: center;
}

form > div {
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  margin-bottom: 6px;
  color: #1565c0;
}

input,
textarea {
  padding: 10px;
  border: 1px solid #90caf9;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  outline: none;
  transition: border-color 0.3s ease;
  min-height: 10px;
}

input:focus,
textarea:focus {
  border-color: #1976d2;
}

.multiselect {
  border: 1px solid #90caf9 !important;
  border-radius: 6px !important;
  padding: 4px !important;
}

.btn-save {
  width: 100%;
  padding: 12px;
  background-color: #2196f3;
  color: white;
  font-weight: bold;
  font-size: 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 16px;
}

.btn-save:hover {
  background-color: #1976d2;
}

.class-list {
  max-width: 100%;
  padding: 40px;
  background: #e1f5fe;
  border-radius: 12px;
  margin: 40px auto;
  box-shadow: 0 4px 10px rgba(0, 123, 255, 0.05);
}

.class-list h3 {
  color: #0d47a1;
  margin-bottom: 20px;
}

.class-table {
  width: 100%;
  border-collapse: collapse;
  background: #ffffff;
  border: 1px solid #bbdefb;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.class-table th {
  background-color: #bbdefb;
  color: #0d47a1;
  padding: 12px;
  text-align: center;
}

.class-table td {
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}

.class-table tr:hover {
  background-color: #e3f2fd;
  transition: background-color 0.3s ease;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
  margin: 0;
}

li {
  padding: 4px 0;
  color: #333;
}

.btn-edit {
  background: #64b5f6;
  color: white;
  padding: 6px 10px;
  border: none;
  border-radius: 5px;
  margin-right: 5px;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-edit:hover {
  background-color: #42a5f5;
}

.btn-delete {
  background: #ef5350;
  color: white;
  padding: 6px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3s ease;
}

.btn-delete:hover {
  background-color: #d32f2f;
}

</style>
