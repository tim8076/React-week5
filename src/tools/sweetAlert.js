import Swal from 'sweetalert2';

// 錯誤提示
export const alertError = (message) => {
  Swal.fire({
    icon: "error",
    text: message,
  });
}

// 確認視窗
export const alertDeleteConfirm = (title) => {
  return Swal.fire({
    title: `確認刪除 ${title} 嗎`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "確認",
    cancelButtonText: "取消"
  });
}

// toast 提示
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  }
});

export const toastAlert = (text) => {
  Toast.fire({
    icon: "success",
    title: text
  });
}