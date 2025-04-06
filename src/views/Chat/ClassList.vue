<template>
  <div class="class-list">
    <h2>My Classes</h2>
    <ul>
      <li
        v-for="classItem in myClasses"
        :key="classItem.id"
        class="class-item"
      >
        <!-- Hiển thị tên lớp, click để mở/đóng chi tiết -->
        <div @click="toggleDetail(classItem.id)" class="class-header">
          {{ classItem.className }}
        </div>
        <!-- Chi tiết lớp: hiển thị thông tin giáo viên và danh sách học sinh -->
        <div v-if="selectedClassId === classItem.id" class="class-detail">
          <!-- Thông tin giáo viên -->
          <p>
            <strong>Tutor:</strong>
            <span
              v-if="classItem.tutorId"
              class="tutor-item"
              @click.stop="openChat(classItem.tutorUserId, classItem.tutorName)"
            >
              {{ classItem.tutorName }}
            </span>
            <span v-else>(No information)</span>
          </p>
          <!-- Danh sách học sinh -->
          <h3>Friends</h3>
          <ul>
            <li
              v-for="(stuName, index) in classItem.studentNames"
              :key="index"
              class="student-item"
              @click.stop="openChat(classItem.studentUserIds[index], stuName)"
            >
              {{ stuName }}
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import classService from "../../api/classService";
import jwtDecode from "jwt-decode";

export default {
  name: "ClassList",
  data() {
    return {
      myClasses: [],
      selectedClassId: null, // ID của lớp được mở chi tiết
    };
  },
  mounted() {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }
    const decoded = jwtDecode(token);

    // Tùy theo vai trò, gọi hàm loadMyClasses hoặc loadMyTutorClasses
    if (decoded.StudentId) {
      classService
        .loadMyClasses()
        .then((classes) => {
          this.myClasses = classes;
        })
        .catch((err) => console.error("Lỗi tải lớp của student:", err));
    } else if (decoded.TutorId) {
      classService
        .loadMyTutorClasses()
        .then((classes) => {
          this.myClasses = classes;
        })
        .catch((err) => console.error("Lỗi tải lớp của tutor:", err));
    } else {
      alert("Bạn không phải Student hay Tutor!");
    }
  },
  methods: {
    // Mở/đóng chi tiết của lớp
    toggleDetail(classId) {
      this.selectedClassId = this.selectedClassId === classId ? null : classId;
    },
    // Mở hộp thoại chat với người dùng có userId
    openChat(userId, name) {
      if (!userId) {
        alert("Không có thông tin để mở chat.");
        return;
      }
      this.$router.push({ name: "ChatDialog", params: { receiverId: userId, receiverName: name, } });
    },
  },
};
</script>

<style scoped>
.class-list {
  max-width: 800px;
  margin: auto;
  padding: 15px;
}
.class-item {
  border: 1px solid #ccc;
  margin-bottom: 10px;
  padding: 10px;
  cursor: pointer;
}
.class-header {
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
}
.class-detail {
  margin-top: 10px;
  padding-left: 15px;
  background: #f9f9f9;
  border-left: 3px solid #007bff;
}
.tutor-item {
  color: blue;
  text-decoration: underline;
  cursor: pointer;
}
.student-item {
  color: #007bff;
  cursor: pointer;
  margin-bottom: 5px;
}
.student-item:hover,
.tutor-item:hover {
  text-decoration: underline;
}
</style>
