import { useState } from "react";
import { locations } from "../Data/location.js";
import { calcAge, ageCategory } from "../Utils/age.js";
import { readAsDataURL, openDataUrl } from "../Utils/Files.js";

const field =
  "w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-sm text-slate-900 " +
  "placeholder:text-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none " +
  "focus:ring-4 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400";
const label = "mb-1.5 block text-sm font-medium text-slate-700";
const errorText = "mt-1 text-xs font-medium text-rose-600";
const KB = 1024;
const uploads = [
  {
    name: "photo",
    label: "Profile Photo (image, max 200 KB)",
    accept: "image/*",
    maxKB: 200,
  },
  {
    name: "aadhaarPdf",
    label: "Aadhaar (PDF, max 500 KB)",
    accept: "application/pdf",
    maxKB: 500,
  },
  {
    name: "idPdf",
    label: "ID Card (PDF, max 500 KB)",
    accept: "application/pdf",
    maxKB: 500,
  },
];

function Section({ title, children }) {
  return (
    <section className="mb-6">
      <h3 className="mb-4 border-b border-slate-100 pb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
        {title}
      </h3>
      {children}
    </section>
  );
}

function RegistrationForm({ editing, onSave, onCancel }) {
  // ---------- 1. STATE ----------
  const [country, setCountry] = useState(editing?.country ?? "");
  const [state, setState] = useState(editing?.state ?? "");
  const [district, setDistrict] = useState(editing?.district ?? "");
  const [form, setForm] = useState({
    firstName: editing?.firstName ?? "",
    middleName: editing?.middleName ?? "",
    lastName: editing?.lastName ?? "",
    dob: editing?.dob ?? "",
    address: editing?.address ?? "",
    role: editing?.role ?? "",
  });
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState({
    photo: editing?.files.photo ?? null,
    aadhaarPdf: editing?.files.aadhaarPdf ?? null,
    idPdf: editing?.files.idPdf ?? null,
  });

  // ---------- 2. DERIVED VALUES ----------
  const states = country ? Object.keys(locations[country]) : [];
  const districts = country && state ? locations[country][state] : [];

  const age = calcAge(form.dob);
  const category = age !== null && age >= 0 ? ageCategory(age) : null;
  const fullName = [form.firstName, form.middleName, form.lastName]
    .filter(Boolean)
    .join(" ");

  // ---------- 3. HANDLERS ----------
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleCountryChange(e) {
    setCountry(e.target.value);
    setState("");
    setDistrict("");
  }

  function handleStateChange(e) {
    setState(e.target.value);
    setDistrict("");
  }

  async function handleFile(e) {
    const input = e.target;
    const { name } = input;
    const file = input.files[0];

    if (!file) {
      setFiles((p) => ({ ...p, [name]: null }));
      return;
    }

    const cfg = uploads.find((u) => u.name === name);
    const isPhoto = name === "photo";
    const okType = isPhoto
      ? file.type.startsWith("image/")
      : file.type === "application/pdf";

    let msg = "";
    if (!okType)
      msg = isPhoto
        ? "Please choose an image file"
        : "Only PDF files are allowed";
    else if (file.size > cfg.maxKB * KB)
      msg = `File must be under ${cfg.maxKB} KB`;

    setErrors((p) => ({ ...p, [name]: msg }));

    if (msg) {
      input.value = "";
      setFiles((p) => ({ ...p, [name]: null }));
      return;
    }

    const url = await readAsDataURL(file); // base64 string, survives refresh
    setFiles((p) => ({
      ...p,
      [name]: { name: file.name, size: file.size, url },
    }));
  }

  function validate() {
    const e = {};
    const nameRe = /^[A-Za-z]+$/;
    if (!form.firstName.trim()) e.firstName = "First name is required";
    else if (!nameRe.test(form.firstName.trim())) e.firstName = "Letters only";
    if (form.middleName.trim() && !nameRe.test(form.middleName.trim()))
      e.middleName = "Letters only";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    else if (!nameRe.test(form.lastName.trim())) e.lastName = "Letters only";
    if (!form.dob) e.dob = "Date of birth is required";
    if (!form.address.trim()) e.address = "Address is required";
    if (!form.role) e.role = "Select Admin or Staff";
    uploads.forEach((u) => {
      if (!files[u.name]) e[u.name] = "This file is required";
    });
    if (!country) e.country = "Select a country";
    if (!state) e.state = "Select a state";
    if (!district) e.district = "Select a district";
    return e;
  }

  function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const record = {
      fullName,
      ...form,
      age,
      category,
      country,
      state,
      district,
      files: {
        photo: files.photo.name,
        aadhaarPdf: files.aadhaarPdf.name,
        idPdf: files.idPdf.name,
      },
    };
    onSave({
      id: editing?.id ?? Date.now(),
      fullName,
      ...form,
      age,
      category,
      country, // was missing
      state,
      district,
      files, // full objects, so the grid and modal can open them
    });
    console.log("Form submitted:", record);
  }

  // ---------- 4. JSX ----------
  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-xl shadow-slate-200/60 ring-1 ring-slate-100 sm:p-8"
    >
      {/* ===== Personal details ===== */}
      <Section title="Personal details">
        <div className="mb-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="firstName" className={label}>
              First Name *
            </label>
            <input
              id="firstName"
              name="firstName"
              className={field}
              value={form.firstName}
              onChange={handleChange}
            />
            {errors.firstName && (
              <p className={errorText}>{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="middleName" className={label}>
              Middle Name
            </label>
            <input
              id="middleName"
              name="middleName"
              className={field}
              value={form.middleName}
              onChange={handleChange}
            />
            {errors.middleName && (
              <p className={errorText}>{errors.middleName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className={label}>
              Last Name *
            </label>
            <input
              id="lastName"
              name="lastName"
              className={field}
              value={form.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <p className={errorText}>{errors.lastName}</p>}
          </div>
        </div>

        {fullName && (
          <p className="mb-4 text-sm text-slate-600">
            Full name:{" "}
            <span className="font-semibold text-slate-900">{fullName}</span>
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="dob" className={label}>
              Date of Birth *
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              className={field}
              max={new Date().toISOString().split("T")[0]}
              value={form.dob}
              onChange={handleChange}
            />
            {errors.dob && <p className={errorText}>{errors.dob}</p>}
          </div>

          <div className="flex items-end gap-3 pb-2.5">
            {category && (
              <>
                <span className="text-sm text-slate-700">
                  Age: <b>{age}</b>
                </span>
                <span
                  className={
                    "rounded-full px-3 py-1 text-xs font-semibold " +
                    (category === "Adult"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700")
                  }
                >
                  {category}
                </span>
              </>
            )}
          </div>
        </div>
      </Section>

      {/* ===== Address ===== */}
      <Section title="Address">
        <div className="mb-4">
          <label htmlFor="address" className={label}>
            Address *
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            className={field}
            value={form.address}
            onChange={handleChange}
          />
          {errors.address && <p className={errorText}>{errors.address}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="country" className={label}>
              Country *
            </label>
            <select
              id="country"
              className={field}
              value={country}
              onChange={handleCountryChange}
            >
              <option value="">Select Country</option>
              {Object.keys(locations).map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.country && <p className={errorText}>{errors.country}</p>}
          </div>

          <div>
            <label htmlFor="state" className={label}>
              State / UT *
            </label>
            <select
              id="state"
              className={field}
              value={state}
              onChange={handleStateChange}
              disabled={!country}
            >
              <option value="">Select State</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.state && <p className={errorText}>{errors.state}</p>}
          </div>

          <div>
            <label htmlFor="district" className={label}>
              District *
            </label>
            <select
              id="district"
              className={field}
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              disabled={!state}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.district && <p className={errorText}>{errors.district}</p>}
          </div>
        </div>
      </Section>

      {/* ===== Booking ===== */}
      <Section title="Booking">
        <div className="sm:w-1/2">
          <label htmlFor="role" className={label}>
            Registered By *
          </label>
          <select
            id="role"
            name="role"
            className={field}
            value={form.role}
            onChange={handleChange}
          >
            <option value="">Select role</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
          </select>
          {errors.role && <p className={errorText}>{errors.role}</p>}
        </div>
      </Section>

      {/* ===== Documents ===== */}
      <Section title="Documents">
        <div className="grid gap-4 sm:grid-cols-3">
          {uploads.map((u) => (
            <div key={u.name}>
              <label htmlFor={u.name} className={label}>
                {u.label} *
              </label>
              <input
                id={u.name}
                name={u.name}
                type="file"
                accept={u.accept}
                onChange={handleFile}
                className="block w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3 text-xs text-slate-500 transition hover:border-indigo-400 hover:bg-indigo-50/40 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-indigo-700"
              />
              {errors[u.name] && <p className={errorText}>{errors[u.name]}</p>}

              {files[u.name] && (
                <div className="mt-2 text-xs text-slate-600">
                  {u.name === "photo" ? (
                    <img
                      src={files.photo.url}
                      alt="Preview"
                      className="h-20 w-20 rounded-full object-cover ring-4 ring-indigo-100"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => openDataUrl(files[u.name].url)}
                      className="font-medium text-indigo-600 underline"
                    >
                      View {files[u.name].name}
                    </button>
                  )}
                  <p className="mt-1">
                    {(files[u.name].size / 1024).toFixed(0)} KB
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* ===== Buttons ===== */}
      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-200 active:scale-[.98]"
        >
          {editing ? "Update Passenger" : "Register"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200 active:scale-[.98]"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default RegistrationForm;
