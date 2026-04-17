import { toast } from "react-toastify";

const activeToastIds = new Set();

const normalizeToastId = (prefix, message) => {
  const safeMessage = String(message || "unknown-error")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 80);

  return `${prefix}-${safeMessage || "error"}`;
};

export const showErrorToast = (message, prefix = "api-error") => {
  if (!message) return;

  const toastId = normalizeToastId(prefix, message);

  if (activeToastIds.has(toastId) || toast.isActive(toastId)) {
    return;
  }

  activeToastIds.add(toastId);

  toast.error(message, {
    toastId,
    onClose: () => {
      activeToastIds.delete(toastId);
    },
  });
};

export const showSuccessToast = (message, options) => {
  if (!message) return;
  toast.success(message, options);
};
