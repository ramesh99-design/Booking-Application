function Toast({ toast, onClose }) {
  if (!toast) return null;

  const styles = {
    success: "bg-emerald-600 shadow-emerald-200",
    danger: "bg-rose-600 shadow-rose-200",
  };

  return (
    <div
      key={toast.id}
      role="status"
      aria-live="polite"
      className={
        "toast-in fixed right-4 top-4 z-50 flex max-w-xs items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg " +
        styles[toast.type]
      }
    >
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-xs">
        {toast.type === "success" ? "✓" : "✕"}
      </span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="text-white/70 transition hover:text-white"
      >
        ×
      </button>
    </div>
  );
}

export default Toast;