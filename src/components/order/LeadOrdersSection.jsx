import LeadOrderActions from "./LeadOrderActions";
import OrderFilterToolbar from "./OrderFilterToolbar";
import OrderListContent from "./OrderListContent";

const LeadOrdersSection = ({
  orderFilter,
  orderSearch,
  onOrderFilterChange,
  onOrderSearchChange,
  orders,
  ordersLoading,
  mutatingOrderId,
  orderCounts,
  onChangeOrderStatus,
}) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body">
      <OrderFilterToolbar
        title="Rendelések kezelése"
        description="Lead maintainer státuszváltó nézet."
        orderFilter={orderFilter}
        orderSearch={orderSearch}
        onOrderFilterChange={onOrderFilterChange}
        onOrderSearchChange={onOrderSearchChange}
      />

      <OrderListContent
        orders={orders}
        loading={ordersLoading}
        loadingText="Rendelések betöltése..."
        emptyText="Nincs a szűrésnek megfelelő rendelés."
        renderActions={(order) => (
          <LeadOrderActions
            order={order}
            isLoading={mutatingOrderId === order.id}
            onChangeStatus={onChangeOrderStatus}
          />
        )}
      />

      <div className="small text-secondary mt-3">
        Pending: {orderCounts.Pending || 0} · InProgress: {orderCounts.InProgress || 0} · Completed: {orderCounts.Completed || 0}
      </div>
    </div>
  </div>
);

export default LeadOrdersSection;
