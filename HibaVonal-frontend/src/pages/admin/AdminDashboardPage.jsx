import AppShell from "../../layout/AppShell";
import DashboardMetricsRow from "../../components/dashboard/DashboardMetricsRow";
import EquipmentManagerCard from "../../components/admin/EquipmentManagerCard";
import WhitelistManagerCard from "../../components/admin/WhitelistManagerCard";
import LoadingCard from "../../components/common/LoadingCard";
import { useAdminDashboard } from "../../hooks/useAdminDashboard";
import { formatCurrency } from "../../utils/formatters";

const AdminDashboardPage = () => {
  const {
    whitelist,
    equipments,
    totalWhitelistCount,
    totalEquipmentCount,
    totalEquipmentValue,
    loading,
    actionLoading,
    whitelistSearch,
    setWhitelistSearch,
    equipmentSearch,
    setEquipmentSearch,
    handleAddNeptun,
    handleAddEquipment,
    handleDeleteEquipment,
  } = useAdminDashboard();

  if (loading) {
    return (
      <AppShell title="Adminisztráció" subtitle="Rendszeradatok betöltése...">
        <LoadingCard text="Adatok szinkronizálása a szerverrel..." />
      </AppShell>
    );
  }

  const metrics = [
    { label: "Engedélyezett kódok", value: totalWhitelistCount, helper: "Regisztrációra várók/kész" },
    { label: "Eszközök száma", value: totalEquipmentCount, helper: "Különböző típusok" },
    { label: "Eszközállomány értéke", value: formatCurrency(totalEquipmentValue), columnClassName: "col-md-6" },
  ];

  return (
    <AppShell 
      title="Rendszer Adminisztráció" 
      subtitle="Eszközök és felhasználói jogosultságok központi kezelése."
    >
      <DashboardMetricsRow metrics={metrics} />

      <div className="row g-4">
        <div className="col-xl-7">
          <EquipmentManagerCard
            equipments={equipments}
            onAdd={handleAddEquipment}
            onDelete={handleDeleteEquipment}
            isLoading={actionLoading}
            searchQuery={equipmentSearch}
            onSearchChange={setEquipmentSearch}
          />
        </div>
        <div className="col-xl-5">
          <WhitelistManagerCard
            list={whitelist}
            onAdd={handleAddNeptun}
            isLoading={actionLoading}
            searchQuery={whitelistSearch}
            onSearchChange={setWhitelistSearch}
          />
        </div>
      </div>
    </AppShell>
  );
};

export default AdminDashboardPage;