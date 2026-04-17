import { ISSUE_STATUS_OPTIONS } from "../../constants/statuses";

const IssueFilterToolbar = ({
  title,
  description,
  issueFilter,
  issueSearch,
  onIssueFilterChange,
  onIssueSearchChange,
  showOnlyUnassigned = false,
  onlyUnassigned = false,
  onOnlyUnassignedChange,
  searchPlaceholder,
}) => (
  <div className="card border-0 shadow-sm mb-4">
    <div className="card-body">
      <div className="d-flex flex-wrap gap-3 align-items-end justify-content-between">
        <div>
          <h3 className="h5 mb-1">{title}</h3>
          <p className="text-secondary mb-0">{description}</p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <div>
            <label className="form-label small">Státusz</label>
            <select
              className="form-select"
              value={issueFilter}
              onChange={(event) => onIssueFilterChange(event.target.value)}
            >
              <option value="">Mind</option>
              {ISSUE_STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          {showOnlyUnassigned ? (
            <div className="form-check align-self-center pt-4">
              <input
                id="onlyUnassigned"
                className="form-check-input"
                type="checkbox"
                checked={onlyUnassigned}
                onChange={(event) =>
                  onOnlyUnassignedChange(event.target.checked)
                }
              />
              <label htmlFor="onlyUnassigned" className="form-check-label">
                Csak kiosztatlan
              </label>
            </div>
          ) : null}

          <div>
            <label className="form-label small">Keresés</label>
            <input
              className="form-control"
              value={issueSearch}
              onChange={(event) => onIssueSearchChange(event.target.value)}
              placeholder={searchPlaceholder}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default IssueFilterToolbar;
