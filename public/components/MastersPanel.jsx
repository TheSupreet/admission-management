const { useState } = React;

function MastersPanel({ useFetch, API }) {
  const {
    data: institutions,
    reload: reloadInst,
    error: instError,
  } = useFetch(API.institutions, []);
  const {
    data: programs,
    reload: reloadPrograms,
    error: progError,
  } = useFetch(API.programs, []);
  const {
    data: seatMatrices,
    reload: reloadSeat,
    error: seatError,
  } = useFetch(API.seatMatrices, []);

  const [instForm, setInstForm] = useState({
    name: "",
    code: "",
    campus: "",
    department: "",
  });

  const [programForm, setProgramForm] = useState({
    institution: "",
    name: "",
    code: "",
    academicYear: "2026",
    courseType: "UG",
    entryTypeOptions: ["Regular"],
    admissionModes: ["Government", "Management"],
  });

  const [seatForm, setSeatForm] = useState({
    program: "",
    academicYear: "2026",
    totalIntake: 100,
    KCET: 50,
    COMEDK: 30,
    MANAGEMENT: 20,
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleCreateInstitution = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(API.institutions, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(instForm),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.message || "Failed to create institution");
      }
      setInstForm({ name: "", code: "", campus: "", department: "" });
      reloadInst();
      showSuccess("Institution created successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...programForm,
        entryTypeOptions: ["Regular", "Lateral"],
        admissionModes: ["Government", "Management"],
      };
      const res = await fetch(API.programs, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.message || "Failed to create program");
      }
      setProgramForm({
        institution: "",
        name: "",
        code: "",
        academicYear: "2026",
        courseType: "UG",
        entryTypeOptions: ["Regular"],
        admissionModes: ["Government", "Management"],
      });
      reloadPrograms();
      showSuccess("Program created successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateSeat = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const baseTotal =
        parseInt(seatForm.KCET || 0) +
        parseInt(seatForm.COMEDK || 0) +
        parseInt(seatForm.MANAGEMENT || 0);

      if (baseTotal !== parseInt(seatForm.totalIntake || 0)) {
        throw new Error(
          `Quota total (${baseTotal}) must equal intake (${seatForm.totalIntake})`,
        );
      }

      const res = await fetch(API.seatMatrices, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          program: seatForm.program,
          academicYear: seatForm.academicYear,
          totalIntake: parseInt(seatForm.totalIntake),
          quotas: {
            KCET: { base: parseInt(seatForm.KCET) },
            COMEDK: { base: parseInt(seatForm.COMEDK) },
            MANAGEMENT: { base: parseInt(seatForm.MANAGEMENT) },
          },
        }),
      });
      if (!res.ok) {
        const j = await res.json();
        throw new Error(j.message || "Failed to create seat matrix");
      }
      setSeatForm({
        program: "",
        academicYear: "2026",
        totalIntake: 100,
        KCET: 50,
        COMEDK: 30,
        MANAGEMENT: 20,
      });
      reloadSeat();
      showSuccess("Seat matrix created successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {successMsg && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#f0fdf4",
            borderLeft: "3px solid #10b981",
            borderRadius: "8px",
            color: "#065f46",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          ✓ {successMsg}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#fef2f2",
            borderLeft: "3px solid #ef4444",
            borderRadius: "8px",
            color: "#991b1b",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          ✕ {error}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">🏫 Institutions</div>
            <div className="card-subtitle">
              Add educational institutions with campus details.
            </div>
          </div>
          <span className="badge badge-success">
            {institutions.length} created
          </span>
        </div>
        <form onSubmit={handleCreateInstitution}>
          <div className="form-grid">
            <div className="field">
              <label>Institution Name*</label>
              <input
                placeholder="E.g., State Engineering College"
                value={instForm.name}
                onChange={(e) =>
                  setInstForm({ ...instForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className="field">
              <label>Code*</label>
              <input
                placeholder="E.g., SEC001"
                value={instForm.code}
                onChange={(e) =>
                  setInstForm({ ...instForm, code: e.target.value })
                }
                required
              />
            </div>
            <div className="field">
              <label>Campus Location*</label>
              <input
                placeholder="E.g., Bangalore"
                value={instForm.campus}
                onChange={(e) =>
                  setInstForm({ ...instForm, campus: e.target.value })
                }
                required
              />
            </div>
            <div className="field">
              <label>Department</label>
              <input
                placeholder="E.g., Engineering"
                value={instForm.department}
                onChange={(e) =>
                  setInstForm({ ...instForm, department: e.target.value })
                }
              />
            </div>
          </div>
          <div className="btn-row">
            <button type="submit" className="btn btn-primary">
              + Create Institution
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">📚 Programs</div>
            <div className="card-subtitle">
              Define academic programs within institutions.
            </div>
          </div>
          <span className="badge badge-success">{programs.length} created</span>
        </div>
        <form onSubmit={handleCreateProgram}>
          <div className="form-grid">
            <div className="field">
              <label>Select Institution*</label>
              <select
                value={programForm.institution}
                onChange={(e) =>
                  setProgramForm({
                    ...programForm,
                    institution: e.target.value,
                  })
                }
                required
              >
                <option value="">Choose an institution</option>
                {institutions.map((i) => (
                  <option key={i._id} value={i._id}>
                    {i.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Program Name*</label>
              <input
                placeholder="E.g., Computer Science"
                value={programForm.name}
                onChange={(e) =>
                  setProgramForm({ ...programForm, name: e.target.value })
                }
                required
              />
            </div>
            <div className="field">
              <label>Program Code*</label>
              <input
                placeholder="E.g., CS001"
                value={programForm.code}
                onChange={(e) =>
                  setProgramForm({ ...programForm, code: e.target.value })
                }
                required
              />
            </div>
            <div className="field">
              <label>Academic Year*</label>
              <input
                placeholder="E.g., 2026"
                value={programForm.academicYear}
                onChange={(e) =>
                  setProgramForm({
                    ...programForm,
                    academicYear: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="field">
              <label>Course Type*</label>
              <select
                value={programForm.courseType}
                onChange={(e) =>
                  setProgramForm({ ...programForm, courseType: e.target.value })
                }
              >
                <option value="UG">Undergraduate (UG)</option>
                <option value="PG">Postgraduate (PG)</option>
              </select>
            </div>
          </div>
          <div className="btn-row">
            <button type="submit" className="btn btn-primary">
              + Create Program
            </button>
          </div>
        </form>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">🎯 Seat Matrix & Quotas</div>
            <div className="card-subtitle">
              Define intake and quota split. Total quota must equal intake.
            </div>
          </div>
          <span className="badge badge-warning">
            {seatMatrices.length} matrices
          </span>
        </div>
        <form onSubmit={handleCreateSeat}>
          <div className="form-grid">
            <div className="field">
              <label>Select Program*</label>
              <select
                value={seatForm.program}
                onChange={(e) =>
                  setSeatForm({ ...seatForm, program: e.target.value })
                }
                required
              >
                <option value="">Choose a program</option>
                {programs.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Academic Year*</label>
              <input
                placeholder="E.g., 2026"
                value={seatForm.academicYear}
                onChange={(e) =>
                  setSeatForm({ ...seatForm, academicYear: e.target.value })
                }
                required
              />
            </div>
            <div className="field">
              <label>Total Intake*</label>
              <input
                type="number"
                placeholder="E.g., 100"
                value={seatForm.totalIntake}
                onChange={(e) =>
                  setSeatForm({
                    ...seatForm,
                    totalIntake: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
            <div className="field">
              <label>KCET Quota</label>
              <input
                type="number"
                placeholder="E.g., 50"
                value={seatForm.KCET}
                onChange={(e) =>
                  setSeatForm({
                    ...seatForm,
                    KCET: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="field">
              <label>COMEDK Quota</label>
              <input
                type="number"
                placeholder="E.g., 30"
                value={seatForm.COMEDK}
                onChange={(e) =>
                  setSeatForm({
                    ...seatForm,
                    COMEDK: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="field">
              <label>Management Quota</label>
              <input
                type="number"
                placeholder="E.g., 20"
                value={seatForm.MANAGEMENT}
                onChange={(e) =>
                  setSeatForm({
                    ...seatForm,
                    MANAGEMENT: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <div
            style={{
              marginTop: "12px",
              padding: "10px 12px",
              backgroundColor: "#eff6ff",
              borderLeft: "3px solid #3b82f6",
              borderRadius: "8px",
              fontSize: "12px",
              color: "#1e40af",
            }}
          >
            <strong>Validation:</strong> KCET + COMEDK + Management must equal
            Total Intake
          </div>
          <div className="btn-row">
            <button type="submit" className="btn btn-primary">
              + Create Seat Matrix
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
