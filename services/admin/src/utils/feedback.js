import Swal from "sweetalert2";

const baseOptions = {
  customClass: {
    popup: "cq-swal",
    confirmButton: "cq-swal-confirm",
    cancelButton: "cq-swal-cancel"
  },
  buttonsStyling: false
};

const toast = Swal.mixin({
  ...baseOptions,
  toast: true,
  position: "top-end",
  timer: 2800,
  timerProgressBar: true,
  showConfirmButton: false,
  showCloseButton: true
});

function showSuccess(title) {
  return toast.fire({
    icon: "success",
    title
  });
}

function showError(title) {
  return toast.fire({
    icon: "error",
    title
  });
}

async function confirmDelete(options = {}) {
  const result = await Swal.fire({
    ...baseOptions,
    icon: "warning",
    title: options.title || "Delete this item?",
    text: options.text || "This action cannot be undone.",
    confirmButtonText: options.confirmButtonText || "Delete",
    cancelButtonText: options.cancelButtonText || "Cancel",
    reverseButtons: true,
    showCancelButton: true
  });

  return result.isConfirmed;
}

export {
  confirmDelete,
  showError,
  showSuccess
};