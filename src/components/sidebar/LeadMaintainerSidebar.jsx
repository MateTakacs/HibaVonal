import IssueDetailPanel from "../issue/IssueDetailPanel";
import LeadOrdersSection from "../order/LeadOrdersSection";
import OrderRequestForm from "../order/OrderRequestForm";

const LeadMaintainerSidebar = ({
  selectedIssue,
  onRefreshAll,
  orderForm,
  creatingOrder,
  onOrderFormChange,
  onCreateOrder,
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
  <>
    <IssueDetailPanel
      issue={selectedIssue}
      title="Részletes nézet"
      extraAction={(
        <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onRefreshAll}>
          Frissítés
        </button>
      )}
    />

    <OrderRequestForm
      title="Új rendelés"
      description="A ToolList választó a seedelt példákból épül, mert a backendből jelenleg nincs lookup endpoint."
      form={orderForm}
      isSubmitting={creatingOrder}
      submitLabel="Rendelés létrehozása"
      onChange={onOrderFormChange}
      onSubmit={onCreateOrder}
    />

    <LeadOrdersSection
      orderFilter={orderFilter}
      orderSearch={orderSearch}
      onOrderFilterChange={onOrderFilterChange}
      onOrderSearchChange={onOrderSearchChange}
      orders={orders}
      ordersLoading={ordersLoading}
      mutatingOrderId={mutatingOrderId}
      orderCounts={orderCounts}
      onChangeOrderStatus={onChangeOrderStatus}
    />
  </>
);

export default LeadMaintainerSidebar;
