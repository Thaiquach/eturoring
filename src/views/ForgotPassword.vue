<template>
    <div class="forgot-password-form">
      <h2>Forgot Password</h2>
      
      <!-- Form nhập email -->
      <form v-if="!isVerificationFormVisible" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Enter your email address:</label>
          <input
            v-model="email"
            type="email"
            id="email"
            placeholder="Enter your email"
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
  
      <!-- Form nhập mã xác minh (verification code) -->
      <form v-if="isVerificationFormVisible" @submit.prevent="handleVerificationSubmit">
        <div class="form-group">
          <label for="verificationCode">Enter the verification code sent to your email:</label>
          <input
            v-model="verificationCode"
            type="text"
            id="verificationCode"
            placeholder="Enter verification code"
            required
          />
        </div>
        <button type="submit">Verify</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        email: '',
        verificationCode: '',
        isVerificationFormVisible: false, // Điều khiển việc hiển thị form nhập mã
      };
    },
    methods: {
      handleSubmit() {
        // Gửi yêu cầu quên mật khẩu và hiển thị form nhập mã
        console.log('Email submitted:', this.email);
        // Giả sử gửi yêu cầu xác thực mã, sau đó hiển thị form nhập mã
        this.isVerificationFormVisible = true;
      },
      handleVerificationSubmit() {
        // Xử lý mã xác minh (verification code)
        console.log('Verification code submitted:', this.verificationCode);
        // Thực hiện bước tiếp theo, ví dụ như reset mật khẩu
        alert('Verification successful. You can now reset your password.');
      }
    }
  };
  </script>
  
  <style scoped>
  .forgot-password-form {
    width: 300px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .forgot-password-form h2 {
    text-align: center;
  }
  
  .forgot-password-form .form-group {
    margin-bottom: 15px;
  }
  
  .forgot-password-form label {
    display: block;
    margin-bottom: 5px;
  }
  
  .forgot-password-form input {
    width: 100%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .forgot-password-form button {
    width: 100%;
    padding: 10px;
    font-size: 14px;
    border: none;
    border-radius: 4px;
    background-color: #4CAF50;
    color: white;
    cursor: pointer;
  }
  
  .forgot-password-form button:hover {
    background-color: #45a049;
  }
  </style>
  