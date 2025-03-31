<template>
  <div class="forgot-password">
    <h2>Quên Mật Khẩu</h2>
    <form @submit.prevent="submitForgotPassword">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          v-model="email"
          type="email"
          id="email"
          required
          placeholder="Nhập email"
        />
      </div>
      <button type="submit">Gửi Link Đổi Mật Khẩu</button>
      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import { sendForgotPasswordEmail } from "../api/authService";

export default {
  data() {
    return {
      email: "",
      message: "",
      error: "",
    };
  },
  methods: {
    async submitForgotPassword() {
      try {
        const response = await sendForgotPasswordEmail(this.email);
        this.message = "Link đổi mật khẩu đã được gửi tới email của bạn.";
        this.error = "";
      } catch (error) {
        this.error =
          error?.message || "Có lỗi xảy ra khi gửi link đổi mật khẩu.";
        this.message = "";
      }
    },
  },
};
</script>

<style scoped>
.forgot-password {
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
