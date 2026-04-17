import OrderFilterToolbar from "./OrderFilterToolbar";
import OrderListContent from "./OrderListContent";

const MaintainerOrdersSection = ({
  orderFilter,
  orderSearch,
  onOrderFilterChange,
  onOrderSearchChange,
  orders,
  ordersLoading,
}) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body">
      <OrderFilterToolbar
        title="Rendelések"
        description="Maintainer nézet a rendelési igényekre."
        orderFilter={orderFilter}
        orderSearch={orderSearch}
        onOrderFilterChange={onOrderFilterChange}
        onOrderSearchChange={onOrderSearchChange}
      />

      <OrderListContent
        orders={orders}
        loading={ordersLoading}
        loadingText="Rendelések betöltése..."
        emptyText="Nincs rendelés a megadott szűrők mellett."
      />
    </div>
  </div>
);

export default MaintainerOrdersSection;
