import { openDataUrl } from "../Utils/Files.js";

function DetailsModal({ passenger: p, onClose }) {
  const row = (k, v) => (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-2.5 text-sm last:border-0">
      <span className="text-slate-500">{k}</span>
      <span className="text-right font-medium text-slate-900">{v}</span>
    </div>
  );

  const pdfButton =
    "flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-indigo-700 transition hover:border-indigo-300 hover:bg-indigo-50 active:scale-[.98]";

  return (
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white shadow-2xl ring-1 ring-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-linear-to-br from-indigo-600 to-sky-500 px-6 pb-12 pt-6 text-center">
          <h2 className="text-lg font-semibold text-white">{p.fullName}</h2>
          <span
            className={
              "mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold " +
              (p.category === "Adult"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-amber-100 text-amber-700")
            }
          >
            {p.category}
          </span>
        </div>

        {/* Photo overlapping the header */}
        <img
          src={p.files.photo.url}
          alt={p.fullName}
          className="-mt-10 mx-auto h-20 w-20 rounded-full object-cover shadow-lg ring-4 ring-white"
        />

        <div className="p-6 pt-3">
          {row("Date of birth", p.dob)}
          {row("Age", `${p.age} years`)}
          {row("Address", p.address)}
          {row("Location", `${p.district}, ${p.state}, ${p.country}`)}
          {row("Registered by", p.role)}

          <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Documents
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => openDataUrl(p.files.aadhaarPdf.url)}
              className={pdfButton}
            >
              📄 Aadhaar PDF
            </button>
            <button
              onClick={() => openDataUrl(p.files.idPdf.url)}
              className={pdfButton}
            >
              📄 ID Card PDF
            </button>
          </div>

          <button
            onClick={onClose}
            className="mt-5 w-full rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 active:scale-[.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsModal;
