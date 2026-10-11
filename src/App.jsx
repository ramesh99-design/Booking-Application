import { useState } from "react";
import RegistrationForm from "./Components/RegistrationForm";
import PassengerGrid from "./Components/PassengerGrid";
import DetailsModal from "./Components/DetailsModal";
import { useLocalStorage } from "./Utils/LocalStorage.js";

function summarize(r) {
  return {
    ...r,
    files: {
      photo: r.files.photo.name,
      aadhaarPdf: r.files.aadhaarPdf.name,
      idPdf: r.files.idPdf.name,
    },
  };
}

export default function App() {
  const [passengers, setPassengers, saveError] = useLocalStorage(
    "booking passengers",
    [],
  );
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [result, setResult] = useState(null);
  const [formKey, setFormKey] = useState(0);

  function handleSave(record) {
    const exists = passengers.some((p) => p.id === record.id);
    setPassengers((prev) =>
      exists
        ? prev.map((p) => (p.id === record.id ? record : p))
        : [record, ...prev],
    );
    const summary = {
      action: exists ? "Updated" : "Registered",
      data: summarize(record),
    };
    setResult(summary);
    console.log("Form submitted:", summary);
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
  }
  function handleDeleteAll() {
    if (passengers.length === 0) return;
    if (
      !window.confirm(
        `Delete all ${passengers.length} passengers? This cannot be undone.`,
      )
    )
      return;
    passengers.forEach((p) =>
      Object.values(p.files).forEach((f) => f && URL.revokeObjectURL(f.url)),
    );
    setPassengers([]);
    handleCancelEdit(); 
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

      {result && (
        <div className="mx-auto mt-6 max-w-3xl rounded-xl bg-white p-6 shadow">
          <h2 className="mb-2 text-lg font-semibold text-slate-800">
            Last submission: {result.action}
          </h2>
          <pre className="overflow-x-auto rounded-lg bg-slate-900 p-4 text-xs text-green-300">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}

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
    </div>
  );
}
