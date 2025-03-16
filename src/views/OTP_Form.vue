<template>
    <div>
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
      otpCode: ''
    };
  },
  methods: {
    async handleVerificationSubmit() {
      try {
        // Giả sử bạn có hàm verifyOTP để gọi API hoặc kiểm tra mã OTP
        const isValid = await this.verifyOTP(this.otpCode);

        if (isValid) {
          alert('Verification successful. You can now reset your password.');
          // Nếu mã OTP đúng, chuyển hướng về trang Login
          this.$router.push('/login');
        } else {
          alert('Invalid OTP code. Please try again.');
          // Nếu mã OTP sai, chuyển hướng sang trang Forgot Password
          this.$router.push('/forgotpassword');
        }
      } catch (error) {
        console.error('Error verifying OTP:', error);
        alert('An error occurred while verifying OTP.');
      }
    },

  }
};
</script>