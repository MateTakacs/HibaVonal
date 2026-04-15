import { ORDER_STATUS_OPTIONS } from "../../constants/statuses";

const OrderFilterToolbar = ({
  title,
  description,
  orderFilter,
  orderSearch,
  onOrderFilterChange,
  onOrderSearchChange,
}) => (
  <div className="d-flex flex-wrap gap-3 align-items-end justify-content-between mb-3">
    <div>
      <h3 className="h5 mb-1">{title}</h3>
      <p className="text-secondary mb-0">{description}</p>
    </div>

    <div className="d-flex gap-2">
      <select
        className="form-select"
        value={orderFilter}
        onChange={(event) => onOrderFilterChange(event.target.value)}
      >
        <option value="">Mind</option>
        {ORDER_STATUS_OPTIONS.map((status) => (
          <option key={status.value} value={status.value}>{status.label}</option>
        ))}
      </select>
      <input
        className="form-control"
        value={orderSearch}
        onChange={(event) => onOrderSearchChange(event.target.value)}
        placeholder="Keresés"
      />
    </div>
  </div>
);

export default OrderFilterToolbar;
