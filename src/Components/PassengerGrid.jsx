import { useState } from "react";

function PassengerGrid({ passengers, onView, onEdit, onDelete, onDeleteAll }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // ---------- search ----------
  const q = search.trim().toLowerCase();
  const filtered = q
    ? passengers.filter((p) =>
        [
          p.fullName,
          p.age,
          p.category,
          p.address,
          p.district,
          p.state,
          p.country,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q),
      )
    : passengers;

  // ---------- pagination ----------
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages); // handles deleting the last row of the last page
  const start = (currentPage - 1) * pageSize;
  const visible = filtered.slice(start, start + pageSize);

  const th =
    "px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500";
  const btn = "rounded-md px-3 py-1 text-xs font-medium ";
  const pageBtn = (active) =>
    "rounded-md px-3 py-1 text-sm " +
    (active
      ? "bg-indigo-600 font-semibold text-white"
      : "bg-slate-100 text-slate-700 hover:bg-slate-200");

  return (
    <div className="mx-auto mt-6 max-w-3xl rounded-xl bg-white p-6 shadow">
      {/* Header: title, search, delete all */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-800">
          Passengers ({passengers.length})
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <input
            type="text"
            placeholder="Search name, age, address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1); // a new search always starts at page 1
            }}
            className="w-56 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
          <button
            onClick={onDeleteAll}
            disabled={passengers.length === 0}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Delete All
          </button>
        </div>
      </div>

      {passengers.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No passengers registered yet.
        </p>
      ) : filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          No passengers match "{search}".
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className={th}>Name</th>
                  <th className={th}>Age</th>
                  <th className={th}>Address</th>
                  <th className={th}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visible.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {p.fullName}
                    </td>
                    <td className="px-4 py-3">
                      {p.age}{" "}
                      <span className="text-xs text-slate-500">
                        ({p.category})
                      </span>
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3">
                      {p.address}
                    </td>
                    <td className="space-x-2 whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => onView(p)}
                        className={
                          btn + "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onEdit(p)}
                        className={
                          btn +
                          "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                        }
                      >
                        Update
                      </button>
                      <button
                        onClick={() => onDelete(p.id)}
                        className={
                          btn + "bg-red-100 text-red-700 hover:bg-red-200"
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer: count, page size, page buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-3">
              <span>
                Showing {start + 1}–{start + visible.length} of{" "}
                {filtered.length}
              </span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-md border border-slate-300 px-2 py-1 text-sm"
              >
                {[5, 10, 20].map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={pageBtn(false) + " disabled:opacity-40"}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={pageBtn(n === currentPage)}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={pageBtn(false) + " disabled:opacity-40"}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PassengerGrid;
