import DashboardMetricsRow from "../../components/dashboard/DashboardMetricsRow";
import MaintainerIssueSection from "../../components/issue/MaintainerIssueSection";
import MaintainerSidebar from "../../components/sidebar/MaintainerSidebar";
import useMaintainerDashboard from "../../hooks/useMaintainerDashboard";
import AppShell from "../../layout/AppShell";

const MaintainerDashboardPage = () => {
  const {
    issues,
    orders,
    selectedIssueId,
    selectedIssue,
    issuesLoading,
    ordersLoading,
    mutatingIssueId,
    creatingOrder,
    issueFilter,
    issueSearch,
    orderFilter,
    orderSearch,
    orderForm,
    issueCounts,
    filteredIssues,
    filteredOrders,
    setIssueFilter,
    setIssueSearch,
    setOrderFilter,
    setOrderSearch,
    handleSelectIssue,
    handleIssueStatusUpdate,
    handleOrderSubmit,
    handleOrderFormChange,
  } = useMaintainerDashboard();

  const metrics = [
    { label: "Összes hozzárendelt hiba", value: issues.length },
    { label: "Nyitott", value: issueCounts.Open || 0 },
    { label: "Folyamatban", value: issueCounts.InProgress || 0 },
    { label: "Megoldva", value: issueCounts.Resolved || 0 },
  ];

  return (
    <AppShell
      title="Maintainer irányítópult"
      subtitle="A hozzád rendelt hibák kezelése, státuszfrissítés és eszközrendelési igények."
    >
      <DashboardMetricsRow metrics={metrics} />

      <div className="row g-4">
        <div className="col-xl-8">
          <MaintainerIssueSection
            issueFilter={issueFilter}
            issueSearch={issueSearch}
            onIssueFilterChange={setIssueFilter}
            onIssueSearchChange={setIssueSearch}
            issues={filteredIssues}
            selectedIssueId={selectedIssueId}
            issuesLoading={issuesLoading}
            mutatingIssueId={mutatingIssueId}
            onSelectIssue={handleSelectIssue}
            onChangeIssueStatus={handleIssueStatusUpdate}
          />
        </div>

        <div className="col-xl-4">
          <MaintainerSidebar
            selectedIssue={selectedIssue}
            orderForm={orderForm}
            creatingOrder={creatingOrder}
            onOrderFormChange={handleOrderFormChange}
            onOrderSubmit={handleOrderSubmit}
            orderFilter={orderFilter}
            orderSearch={orderSearch}
            onOrderFilterChange={setOrderFilter}
            onOrderSearchChange={setOrderSearch}
            orders={filteredOrders}
            ordersLoading={ordersLoading}
          />
        </div>
      </div>
    </AppShell>
  );
};

export default MaintainerDashboardPage;
