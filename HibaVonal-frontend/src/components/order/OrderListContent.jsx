import OrderCard from "./OrderCard";

const OrderListContent = ({
  orders,
  loading,
  loadingText,
  emptyText,
  renderActions,
}) => {
  if (loading) {
    return <div>{loadingText}</div>;
  }

  if (orders.length === 0) {
    return <p className="text-secondary mb-0">{emptyText}</p>;
  }

  return (
    <div className="d-grid gap-3">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          actions={renderActions ? renderActions(order) : null}
        />
      ))}
    </div>
  );
};

export default OrderListContent;
