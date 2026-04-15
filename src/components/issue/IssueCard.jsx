import StatusBadge from "../common/StatusBadge";
import { formatDateTime } from "../../utils/formatters";

const IssueCard = ({ issue, actions, isSelected, onSelect }) => (
  <div className={`card border-0 shadow-sm issue-card ${isSelected ? "selected" : ""}`}>
    <div className="card-body">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-start mb-3">
        <div>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <h3 className="h5 mb-0">#{issue.id}</h3>
            <StatusBadge value={issue.status} />
            <StatusBadge value={issue.urgency} />
          </div>
          <div className="small text-secondary mt-2">Bejelentve: {formatDateTime(issue.reportDate)}</div>
        </div>
        <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => onSelect(issue.id)}>
          Részletek
        </button>
      </div>

      <p className="mb-3">{issue.description}</p>

      <div className="row g-3 small">
        <div className="col-md-6">
          <div className="text-secondary">Szoba</div>
          <div className="fw-semibold">{issue.roomNumber || "—"}</div>
        </div>
        <div className="col-md-6">
          <div className="text-secondary">Eszköz</div>
          <div className="fw-semibold">{issue.equipmentName || "—"}</div>
        </div>
        <div className="col-md-6">
          <div className="text-secondary">Bejelentő</div>
          <div className="fw-semibold">{issue.reporterName || "—"}</div>
          {issue.reporterEmail ? <div className="text-secondary">{issue.reporterEmail}</div> : null}
        </div>
        <div className="col-md-6">
          <div className="text-secondary">Kijelölt karbantartó</div>
          <div className="fw-semibold">{issue.assignedMaintainerName || "Nincs kiosztva"}</div>
          {issue.assignedMaintainerEmail ? <div className="text-secondary">{issue.assignedMaintainerEmail}</div> : null}
        </div>
      </div>

      {actions ? <div className="mt-4 d-flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  </div>
);

export default IssueCard;
