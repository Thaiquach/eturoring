<template>
  <div class="profile">
    <h2>Thông Tin Profile</h2>
    <div v-if="profile">
      <!-- Hiển thị thông tin chung từ AppUser -->
      <p><strong>Họ và tên:</strong> {{ profile.user?.fullName }}</p>
      <p><strong>Tên đăng nhập:</strong> {{ profile.user?.userName }}</p>
      <p><strong>Email:</strong> {{ profile.user?.email }}</p>

      <!-- Nếu là Student -->
      <div v-if="isStudent && profile.studentCode">
        <p><strong>Mã sinh viên:</strong> {{ profile.studentCode }}</p>
        <p><strong>Khóa học:</strong> {{ profile.course }}</p>
        <p><strong>Trạng thái:</strong> {{ profile.status }}</p>
      </div>

      <!-- Nếu là Tutor -->
      <div v-else-if="!isStudent && profile.department">
        <p><strong>Bộ môn:</strong> {{ profile.department }}</p>
        <p><strong>Số năm kinh nghiệm:</strong> {{ profile.experienceYears }}</p>
        <p><strong>Đánh giá:</strong> {{ profile.rating }}</p>
      </div>
    </div>
    <div v-else>
      <p>Đang tải thông tin profile...</p>
    </div>
  </div>
</template>

---

### ✅ **Script Đã Chỉnh Sửa**

```javascript
<script>
import { getUserFromToken } from "../helpers/authHelper";
import { getStudentProfile, getTutorProfile } from "../api/profileService";

export default {
  data() {
    return {
      profile: null,
      isStudent: true,
      isAdmin: false,
    };
  },
  async mounted() {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage
    const user = getUserFromToken(token);
    console.log("Token đã giải mã:", user); // Debug token

    if (user) {
      // Sử dụng Object.keys để kiểm tra key trong token
      const keys = Object.keys(user);
      console.log("Danh sách key trong token:", keys);

      // Xử lý theo vai trò
      switch (user.role) {
        case "Student":
          // Xử lý nếu StudentId có chữ hoa
          if (user.StudentId || user.studentId) {
            const studentId = user.StudentId || user.studentId;
            console.log("Đang lấy thông tin student với ID:", studentId);
            this.isStudent = true;
            await this.fetchStudentProfile(studentId, token);
          } else {
            console.error("Không tìm thấy studentId.");
          }
          break;

        case "Tutor":
          if (user.TutorId || user.tutorId) {
            const tutorId = user.TutorId || user.tutorId;
            console.log("Đang lấy thông tin tutor với ID:", tutorId);
            this.isStudent = false;
            await this.fetchTutorProfile(tutorId, token);
          } else {
            console.error("Không tìm thấy tutorId.");
          }
          break;

        case "Admin":
          console.log("Đăng nhập với vai trò admin.");
          this.isAdmin = true;
          this.profile = {
            user: {
              fullName: "Admin",
              userName: "admin",
              email: "admin@example.com",
            },
          };
          break;

        default:
          console.error("Vai trò không hợp lệ.");
      }
    } else {
      console.error("Không tìm thấy thông tin người dùng từ token.");
    }
  },
  methods: {
    // Lấy thông tin Student từ API
    async fetchStudentProfile(studentId, token) {
      try {
        const data = await getStudentProfile(studentId, token);
        console.log("Dữ liệu profile Student:", data);
        this.profile = data;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin học sinh:", error);
      }
    },
    // Lấy thông tin Tutor từ API
    async fetchTutorProfile(tutorId, token) {
      try {
        const data = await getTutorProfile(tutorId, token);
        console.log("Dữ liệu profile Tutor:", data);
        this.profile = data;
      } catch (error) {
        console.error("Lỗi khi lấy thông tin tutor:", error);
      }
    },
  },
};
</script>


<style scoped>
.profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>
