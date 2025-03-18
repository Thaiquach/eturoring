import { ref, onMounted } from 'vue';

export function useToken() {
  const token = ref('');

  onMounted(() => {
    token.value = localStorage.getItem('token') || 'No token found';
  });

  return { token };
}
