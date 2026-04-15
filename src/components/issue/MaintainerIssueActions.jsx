import { ISSUE_STATUS_OPTIONS, MAINTAINER_ALLOWED_ISSUE_STATUSES } from "../../constants/statuses";

const LABEL_BY_VALUE = ISSUE_STATUS_OPTIONS.reduce((accumulator, option) => {
  accumulator[option.value] = option.label;
  return accumulator;
}, {});

const MaintainerIssueActions = ({ issue, isLoading, onChangeStatus }) => {
  return MAINTAINER_ALLOWED_ISSUE_STATUSES.map((status) => (
    <button
      key={status}
      type="button"
      className="btn btn-sm btn-primary"
      disabled={isLoading || issue.status === status}
      onClick={() => onChangeStatus(issue.id, status)}
    >
      {isLoading ? "Mentés..." : `${LABEL_BY_VALUE[status]} állapot`}
    </button>
  ));
};

export default MaintainerIssueActions;
