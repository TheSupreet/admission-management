function ApplicantRow({ applicant, onChange }) {
  const updateField = async (path, status) => {
    let url;
    let method = "PATCH";
    let body;

    if (path === "documents") {
      url = `/api/applicants/${applicant._id}/documents`;
      body = { status };
    } else if (path === "fee") {
      url = `/api/applicants/${applicant._id}/fee`;
      body = { status };
    } else if (path === "confirm") {
      url = `/api/applicants/${applicant._id}/confirm`;
      method = "POST";
      body = {};
    }

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      onChange();
    }
  };

  const admissionChipClass =
    applicant.admissionStatus === "Confirmed"
      ? "chip chip-status-confirmed"
      : "chip chip-status-locked";

  const docsChipClass =
    applicant.documentsStatus === "Verified"
      ? "chip chip-status-confirmed"
      : "chip chip-status-pending";

  const feeChipClass =
    applicant.feeStatus === "Paid"
      ? "chip chip-status-confirmed"
      : "chip chip-status-pending";

  return (
    <tr>
      <td>
        {applicant.basicDetails?.firstName} {applicant.basicDetails?.lastName}
        <div style={{ fontSize: 10, color: "#6b7280" }}>
          {applicant.category}
        </div>
      </td>
      <td>{applicant.program?.name}</td>
      <td>{applicant.quotaType}</td>
      <td>
        <span className={docsChipClass}>{applicant.documentsStatus}</span>
        {applicant.documentsStatus !== "Verified" && (
          <button
            className="btn btn-secondary"
            style={{ marginLeft: 4, padding: "2px 8px", fontSize: 10 }}
            onClick={() => updateField("documents", "Verified")}
          >
            Mark Verified
          </button>
        )}
      </td>
      <td>
        <span className={feeChipClass}>{applicant.feeStatus}</span>
        {applicant.feeStatus !== "Paid" && (
          <button
            className="btn btn-secondary"
            style={{ marginLeft: 4, padding: "2px 8px", fontSize: 10 }}
            onClick={() => updateField("fee", "Paid")}
          >
            Mark Paid
          </button>
        )}
      </td>
      <td>
        <span className={admissionChipClass}>
          {applicant.admissionStatus}
          {applicant.admissionNumber ? ` (${applicant.admissionNumber})` : ""}
        </span>
      </td>
      <td>
        <button
          className="btn btn-primary"
          style={{ padding: "3px 10px", fontSize: 10 }}
          onClick={() => updateField("confirm")}
        >
          Confirm
        </button>
      </td>
    </tr>
  );
}
