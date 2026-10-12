import { useRef, useState } from "react";
import Toast from "./Components/Toast.jsx";
import RegistrationForm from "./Components/RegistrationForm";
import PassengerGrid from "./Components/PassengerGrid";
import DetailsModal from "./Components/DetailsModal";
import { useLocalStorage } from "./Utils/LocalStorage.js";

export default function App() {
  const [passengers, setPassengers, saveError] = useLocalStorage(
    "booking passengers",
    [],
  );
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [formKey, setFormKey] = useState(0);
  const [toast, setToast] = useState(null);
  const timer = useRef(null);

  function showToast(message, type = "success") {
    clearTimeout(timer.current); // a new toast replaces the old one
    setToast({ message, type, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 3000);
  }

  function handleSave(record) {
    const exists = passengers.some((p) => p.id === record.id);
    setPassengers((prev) =>
      exists
        ? prev.map((p) => (p.id === record.id ? record : p))
        : [record, ...prev],
    );
    showToast(
      exists
        ? `Passenger updated: ${record.fullName}`
        : `Passenger added: ${record.fullName}`,
    );
    setEditing(null);
    setFormKey((k) => k + 1);
  }
  function handleEdit(p) {
    setEditing(p);
    setFormKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditing(null);
    setFormKey((k) => k + 1);
  }

  function handleDelete(id) {
    const p = passengers.find((x) => x.id === id);
    if (!window.confirm(`Delete ${p.fullName}?`)) return;
    setPassengers((prev) => prev.filter((x) => x.id !== id));
    if (editing?.id === id) handleCancelEdit();
    showToast(`Passenger deleted: ${p.fullName}`, "danger");
  }
  function handleDeleteAll() {
    if (passengers.length === 0) return;
    if (
      !window.confirm(
        `Delete all ${passengers.length} passengers? This cannot be undone.`,
      )
    )
      return;
    setPassengers([]);
    handleCancelEdit();
    showToast("All passengers deleted", "danger");
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-sky-50 px-4 py-10">
      <header className="mx-auto mb-8 max-w-3xl text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-2xl text-white shadow-lg shadow-indigo-200">
          ✈
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Booking Application
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Register passengers and manage their details
        </p>
      </header>

      <RegistrationForm
        key={formKey}
        editing={editing}
        onSave={handleSave}
        onCancel={handleCancelEdit}
      />

      <PassengerGrid
        passengers={passengers}
        onView={setViewing}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDeleteAll={handleDeleteAll}
      />
      {viewing && (
        <DetailsModal passenger={viewing} onClose={() => setViewing(null)} />
      )}
      {saveError && (
        <div className="mx-auto mt-6 max-w-3xl rounded-lg bg-amber-100 p-3 text-sm text-amber-800">
          {saveError}
        </div>
      )}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
