import StatusBadge from "../common/StatusBadge";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

const OrderCard = ({ order, actions }) => (
  <div className="card border-0 shadow-sm h-100">
    <div className="card-body">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-start mb-3">
        <div>
          <h3 className="h5 mb-1">Rendelés #{order.id}</h3>
          <div className="small text-secondary">
            Rögzítve: {formatDateTime(order.orderDate)}
          </div>
        </div>
        <StatusBadge value={order.status} />
      </div>

      <div className="small text-secondary mb-1">Eszköz</div>
      <div className="fw-semibold mb-3">
        {order.toolMaker} {order.toolModel}
      </div>

      <div className="row g-3 small">
        <div className="col-sm-6">
          <div className="text-secondary">Szállítás</div>
          <div className="fw-semibold">
            {formatDateTime(order.deliveryDate)}
          </div>
        </div>
        <div className="col-sm-6">
          <div className="text-secondary">Ár</div>
          <div className="fw-semibold">{formatCurrency(order.toolPrice)}</div>
        </div>
      </div>

      {actions ? (
        <div className="mt-4 d-flex flex-wrap gap-2">{actions}</div>
      ) : null}
    </div>
  </div>
);

export default OrderCard;
