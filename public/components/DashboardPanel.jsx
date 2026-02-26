const { useEffect } = React;

function DashboardPanel({ useFetch, API }) {
  const { data, reload } = useFetch(API.dashboard, null);

  useEffect(() => {
    const id = setInterval(reload, 8000);
    return () => clearInterval(id);
  }, [reload]);

  if (!data) {
    return <div className="card">Loading dashboard…</div>;
  }

  const {
    totalIntake,
    admitted,
    quotaFilled,
    remainingSeats,
    pendingDocuments,
    feePending,
  } = data;

  return (
    <div className="grid-two">
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">📊 Seat Filling Snapshot</div>
            <div className="card-subtitle">
              Real-time overview of intake vs admitted students across all
              programs.
            </div>
          </div>
          <span className="badge badge-success">Live Data</span>
        </div>
        <div className="stats-row">
          <div className="stat-pill">
            <strong>Total Intake</strong>
            <span>{totalIntake}</span>
          </div>
          <div className="stat-pill">
            <strong>Admitted</strong>
            <span>{admitted}</span>
          </div>
          <div className="stat-pill">
            <strong>KCET Filled</strong>
            <span>{quotaFilled.KCET}</span>
          </div>
          <div className="stat-pill">
            <strong>COMEDK Filled</strong>
            <span>{quotaFilled.COMEDK}</span>
          </div>
          <div className="stat-pill">
            <strong>Mgmt Filled</strong>
            <span>{quotaFilled.MANAGEMENT}</span>
          </div>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Program</th>
              <th>Year</th>
              <th>KCET Left</th>
              <th>COMEDK Left</th>
              <th>Mgmt Left</th>
            </tr>
          </thead>
          <tbody>
            {remainingSeats.map((r, idx) => (
              <tr key={idx}>
                <td>{r.programName}</td>
                <td>{r.academicYear}</td>
                <td>{r.quotas.KCET}</td>
                <td>{r.quotas.COMEDK}</td>
                <td>{r.quotas.MANAGEMENT}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">⚠️ Pending Actions</div>
            <div className="card-subtitle">
              Students with incomplete documents or pending fee payments.
            </div>
          </div>
          <span className="badge badge-warning">Attention Required</span>
        </div>
        <div className="grid-two">
          <div>
            <div className="card-subtitle">Documents Pending</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingDocuments.map((a) => (
                  <tr key={a._id}>
                    <td>
                      {a.basicDetails.firstName} {a.basicDetails.lastName}
                    </td>
                    <td>{a.documentsStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <div className="card-subtitle">Fee Pending</div>
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {feePending.map((a) => (
                  <tr key={a._id}>
                    <td>
                      {a.basicDetails.firstName} {a.basicDetails.lastName}
                    </td>
                    <td>{a.feeStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
