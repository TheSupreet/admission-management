const { useState } = React;

function ApplicantPanel({ useFetch, API, ApplicantRow }) {
  const { data: programs } = useFetch(API.programs, []);
  const { data: applicants, reload: reloadApplicants } = useFetch(
    API.applicants,
    [],
  );
  const [mode, setMode] = useState("Government");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    category: "GM",
    entryType: "Regular",
    quotaType: "KCET",
    marks: 0,
    programId: "",
    academicYear: "2026",
    allotmentNumber: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        basicDetails: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
        },
        category: form.category,
        entryType: form.entryType,
        quotaType: form.quotaType,
        admissionMode: mode,
        marks: Number(form.marks),
        programId: form.programId,
        academicYear: form.academicYear,
        allotmentNumber: mode === "Government" ? form.allotmentNumber : null,
      };
      const res = await fetch(API.allocate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to allocate seat");
      }
      reloadApplicants();
    } catch (err) {
      setError(err.message);
    }
  };

  const quotasForMode =
    mode === "Government"
      ? [
          { id: "KCET", label: "K-CET" },
          { id: "COMEDK", label: "COMEDK" },
        ]
      : [{ id: "MANAGEMENT", label: "Management" }];

  return (
    <div className="grid-two">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">👤 Applicant & Seat Allocation</div>
            <div className="card-subtitle">
              Create applicant and allocate a seat with real-time quota
              validation.
            </div>
          </div>
          <span className="badge badge-success">Admission Officer</span>
        </div>

        <div
          className="btn-row"
          style={{ justifyContent: "flex-start", marginBottom: 6 }}
        >
          <button
            type="button"
            className={`btn btn-secondary ${mode === "Government" ? "active" : ""}`}
            onClick={() => setMode("Government")}
          >
            Government Flow
          </button>
          <button
            type="button"
            className={`btn btn-secondary ${mode === "Management" ? "active" : ""}`}
            onClick={() => setMode("Management")}
          >
            Management Flow
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="field">
              <label>First Name</label>
              <input
                value={form.firstName}
                onChange={(e) =>
                  setForm({ ...form, firstName: e.target.value })
                }
                required
              />
            </div>
            <div className="field">
              <label>Last Name</label>
              <input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="GM">GM</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="OBC">OBC</option>
              </select>
            </div>
            <div className="field">
              <label>Entry Type</label>
              <select
                value={form.entryType}
                onChange={(e) =>
                  setForm({ ...form, entryType: e.target.value })
                }
              >
                <option value="Regular">Regular</option>
                <option value="Lateral">Lateral</option>
              </select>
            </div>
            <div className="field">
              <label>Quota Type</label>
              <select
                value={form.quotaType}
                onChange={(e) =>
                  setForm({ ...form, quotaType: e.target.value })
                }
              >
                {quotasForMode.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Marks / Rank</label>
              <input
                type="number"
                value={form.marks}
                onChange={(e) => setForm({ ...form, marks: e.target.value })}
              />
            </div>
            <div className="field">
              <label>Program</label>
              <select
                value={form.programId}
                onChange={(e) =>
                  setForm({ ...form, programId: e.target.value })
                }
                required
              >
                <option value="">Select</option>
                {programs.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Academic Year</label>
              <input
                value={form.academicYear}
                onChange={(e) =>
                  setForm({ ...form, academicYear: e.target.value })
                }
              />
            </div>
            {mode === "Government" && (
              <div className="field">
                <label>Allotment Number</label>
                <input
                  value={form.allotmentNumber}
                  onChange={(e) =>
                    setForm({ ...form, allotmentNumber: e.target.value })
                  }
                  required={mode === "Government"}
                />
              </div>
            )}
          </div>
          <div className="btn-row">
            <button type="submit" className="btn btn-primary">
              Allocate Seat
            </button>
          </div>
        </form>
        <div className="notice">
          Seats are automatically blocked when quota is full. Quota seats cannot
          exceed intake as per system rules.
        </div>
        {error && <div className="error">{error}</div>}
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">📋 Applicants & Status</div>
            <div className="card-subtitle">
              Track document verification, fee status, and admission
              confirmation.
            </div>
          </div>
          <span className="badge badge-neutral">Live List</span>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Program</th>
              <th>Quota</th>
              <th>Docs</th>
              <th>Fee</th>
              <th>Admission</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((a) => (
              <ApplicantRow
                key={a._id}
                applicant={a}
                onChange={reloadApplicants}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
