import { ISSUE_STATUS_OPTIONS } from "../../constants/statuses";

const LeadIssueActions = ({
  issue,
  maintainers,
  assignValue,
  maintainersLoading,
  isLoading,
  onAssignValueChange,
  onAssign,
  onChangeStatus,
}) => {
  return (
    <>
      <div className="assign-box">
        <select
          className="form-select form-select-sm"
          value={assignValue || ""}
          onChange={(event) =>
            onAssignValueChange(issue.id, event.target.value)
          }
        >
          <option value="">Karbantartó kiválasztása</option>
          {maintainers.map((maintainer) => (
            <option key={maintainer.id} value={maintainer.id}>
              {maintainer.name} ({maintainer.username})
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => onAssign(issue.id)}
          disabled={isLoading || maintainersLoading}
        >
          {isLoading ? "Mentés..." : "Kiosztás"}
        </button>
      </div>

      {ISSUE_STATUS_OPTIONS.map((status) => (
        <button
          key={status.value}
          type="button"
          className="btn btn-sm btn-primary"
          disabled={isLoading || issue.status === status.value}
          onClick={() => onChangeStatus(issue.id, status.value)}
        >
          {status.label}
        </button>
      ))}
    </>
  );
};

export default LeadIssueActions;
