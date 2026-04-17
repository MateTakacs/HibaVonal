import { ORDER_STATUS_OPTIONS } from "../../constants/statuses";

const LeadOrderActions = ({ order, isLoading, onChangeStatus }) => {
  return ORDER_STATUS_OPTIONS.map((status) => (
    <button
      key={status.value}
      type="button"
      className="btn btn-sm btn-outline-primary"
      disabled={isLoading || order.status === status.value}
      onClick={() => onChangeStatus(order.id, status.value)}
    >
      {isLoading ? "Mentés..." : status.label}
    </button>
  ));
};

export default LeadOrderActions;
