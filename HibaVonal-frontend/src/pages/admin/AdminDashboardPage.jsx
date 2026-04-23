import AppShell from "../../layout/AppShell";
import DashboardMetricsRow from "../../components/dashboard/DashboardMetricsRow";
import EquipmentManagerCard from "../../components/admin/EquipmentManagerCard";
import WhitelistManagerCard from "../../components/admin/WhitelistManagerCard";
import UserManagerCard from "../../components/admin/UserManagerCard";
import LoadingCard from "../../components/common/LoadingCard";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import { formatCurrency } from "../../utils/formatters";

const AdminDashboardPage = () => {
  const {
    whitelist, equipments, users, totalWhitelistCount, totalEquipmentCount,
    totalUserCount, totalEquipmentValue, loading, actionLoading,
    whitelistSearch, setWhitelistSearch, equipmentSearch, setEquipmentSearch,
    userSearch, setUserSearch, handleAddNeptun, handleAddEquipment,
    handleDeleteEquipment, handleUpdateRole
  } = useAdminDashboard();

  if (loading) return <AppShell title="Admin"><LoadingCard text="Adatok betöltése..." /></AppShell>;

  const metrics = [
    { label: "Kódok", value: totalWhitelistCount, helper: "Fehérlista" },
    { label: "Eszközök", value: totalEquipmentCount, helper: "Típusok" },
    { label: "Összérték", value: formatCurrency(totalEquipmentValue), columnClassName: "col-md-6" },
    { label: "Felhasználók", value: totalUserCount, helper: "Regisztrált" }
  ];

  return (
    <AppShell title="Adminisztráció">
      <DashboardMetricsRow metrics={metrics} />
      <div className="row g-4 mb-4">
        <div className="col-xl-7">
          <EquipmentManagerCard equipments={equipments} onAdd={handleAddEquipment} onDelete={handleDeleteEquipment} isLoading={actionLoading} searchQuery={equipmentSearch} onSearchChange={setEquipmentSearch} />
        </div>
        <div className="col-xl-5">
          <WhitelistManagerCard list={whitelist} onAdd={handleAddNeptun} isLoading={actionLoading} searchQuery={whitelistSearch} onSearchChange={setWhitelistSearch} />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <UserManagerCard users={users} onUpdateRole={handleUpdateRole} isLoading={actionLoading} searchQuery={userSearch} onSearchChange={setUserSearch} />
        </div>
      </div>
    </AppShell>
  );
};

export default AdminDashboardPage;