import DashboardMetricsRow from "../../components/dashboard/DashboardMetricsRow";
import LeadIssueSection from "../../components/issue/LeadIssueSection";
import LeadMaintainerSidebar from "../../components/sidebar/LeadMaintainerSidebar";
import useLeadMaintainerDashboard from "../../hooks/useLeadMaintainerDashboard";
import AppShell from "../../layout/AppShell";

const LeadMaintainerDashboardPage = () => {
  const {
    issues,
    maintainers,
    selectedIssueId,
    selectedIssue,
    issuesLoading,
    ordersLoading,
    maintainersLoading,
    mutatingIssueId,
    mutatingOrderId,
    creatingOrder,
    issueFilter,
    onlyUnassigned,
    issueSearch,
    orderFilter,
    orderSearch,
    assignFormByIssueId,
    orderForm,
    orderCounts,
    unassignedCount,
    filteredIssues,
    filteredOrders,
    setIssueFilter,
    setOnlyUnassigned,
    setIssueSearch,
    setOrderFilter,
    setOrderSearch,
    handleSelectIssue,
    handleAssignFormChange,
    handleAssignIssue,
    handleIssueStatusUpdate,
    handleCreateOrder,
    handleOrderFormChange,
    handleOrderStatusUpdate,
    handleRefreshAll,
  } = useLeadMaintainerDashboard();

  const metrics = [
    { label: "Összes hibajegy", value: issues.length },
    { label: "Kiosztatlan hibák", value: unassignedCount },
    { label: "Aktív rendelések", value: (orderCounts.Pending || 0) + (orderCounts.InProgress || 0) },
    {
      label: "Elérhető karbantartók",
      value: maintainers.length,
      helper: maintainersLoading ? "Frissítés..." : "Backendből lekérve",
    },
  ];

  return (
    <AppShell
      title="Lead maintainer irányítópult"
      subtitle="Kiosztás, teljes hibalista, státuszkezelés és rendelési folyamatok egy helyen."
    >
      <DashboardMetricsRow metrics={metrics} />

      <div className="row g-4">
        <div className="col-xl-8">
          <LeadIssueSection
            issueFilter={issueFilter}
            onlyUnassigned={onlyUnassigned}
            issueSearch={issueSearch}
            onIssueFilterChange={setIssueFilter}
            onOnlyUnassignedChange={setOnlyUnassigned}
            onIssueSearchChange={setIssueSearch}
            issues={filteredIssues}
            selectedIssueId={selectedIssueId}
            issuesLoading={issuesLoading}
            maintainers={maintainers}
            maintainersLoading={maintainersLoading}
            assignFormByIssueId={assignFormByIssueId}
            mutatingIssueId={mutatingIssueId}
            onSelectIssue={handleSelectIssue}
            onAssignFormChange={handleAssignFormChange}
            onAssignIssue={handleAssignIssue}
            onChangeIssueStatus={handleIssueStatusUpdate}
          />
        </div>

        <div className="col-xl-4">
          <LeadMaintainerSidebar
            selectedIssue={selectedIssue}
            onRefreshAll={handleRefreshAll}
            orderForm={orderForm}
            creatingOrder={creatingOrder}
            onOrderFormChange={handleOrderFormChange}
            onCreateOrder={handleCreateOrder}
            orderFilter={orderFilter}
            orderSearch={orderSearch}
            onOrderFilterChange={setOrderFilter}
            onOrderSearchChange={setOrderSearch}
            orders={filteredOrders}
            ordersLoading={ordersLoading}
            mutatingOrderId={mutatingOrderId}
            orderCounts={orderCounts}
            onChangeOrderStatus={handleOrderStatusUpdate}
          />
        </div>
      </div>
    </AppShell>
  );
};

export default LeadMaintainerDashboardPage;
