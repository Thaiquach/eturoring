<template>
    <div class="reset-password">
      <h2>Đổi Mật Khẩu</h2>
      <form @submit.prevent="submitResetPassword">
        <div class="form-group">
          <label for="newPassword">Mật khẩu mới</label>
          <input
            v-model="newPassword"
            type="password"
            id="newPassword"
            required
            placeholder="Nhập mật khẩu mới"
          />
        </div>
        <button type="submit">Đổi Mật Khẩu</button>
        <p v-if="message" class="success">{{ message }}</p>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script>
  import { resetPassword } from "../api/authService";
  
  export default {
    data() {
      return {
        newPassword: "",
        token: "",
        email: "",
        message: "",
        error: "",
      };
    },
    mounted() {
      // ✅ Lấy token và email từ URL khi người dùng click vào link
      const queryParams = new URLSearchParams(window.location.search);
      this.token = queryParams.get("token");
      this.email = queryParams.get("email");
    },
    methods: {
      async submitResetPassword() {
        try {
          const response = await resetPassword(
            this.email,
            this.newPassword,
            this.token
          );
          // ✅ Hiển thị thông báo thành công
          this.message =
            response.message || "Mật khẩu đã được đổi thành công.";
          this.error = "";
        } catch (error) {
          this.error =
            error?.message || "Có lỗi xảy ra khi đặt lại mật khẩu.";
          this.message = "";
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .reset-password {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
  }
  form {
    display: flex;
    flex-direction: column;
  }
  input {
    padding: 10px;
    margin-top: 8px;
  }
  button {
    margin-top: 15px;
    padding: 10px;
    cursor: pointer;
  }
  .success {
    color: green;
  }
  .error {
    color: red;
  }
  </style>
  