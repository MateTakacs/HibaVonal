import IssueDetailPanel from "../issue/IssueDetailPanel";
import MaintainerOrdersSection from "../order/MaintainerOrdersSection";
import OrderRequestForm from "../order/OrderRequestForm";

const MaintainerSidebar = ({
  selectedIssue,
  orderForm,
  creatingOrder,
  onOrderFormChange,
  onOrderSubmit,
  orderFilter,
  orderSearch,
  onOrderFilterChange,
  onOrderSearchChange,
  orders,
  ordersLoading,
}) => (
  <>
    <IssueDetailPanel
      issue={selectedIssue}
      title="Kijelölt hibajegy részletei"
    />

    <OrderRequestForm
      title="Eszközrendelési igény"
      description="A backend jelenleg nem ad ToolList lekérdező API-t, ezért a frontend a seedelt példákat használja."
      form={orderForm}
      isSubmitting={creatingOrder}
      submitLabel="Rendelési igény rögzítése"
      onChange={onOrderFormChange}
      onSubmit={onOrderSubmit}
    />

    <MaintainerOrdersSection
      orderFilter={orderFilter}
      orderSearch={orderSearch}
      onOrderFilterChange={onOrderFilterChange}
      onOrderSearchChange={onOrderSearchChange}
      orders={orders}
      ordersLoading={ordersLoading}
    />
  </>
);

export default MaintainerSidebar;
