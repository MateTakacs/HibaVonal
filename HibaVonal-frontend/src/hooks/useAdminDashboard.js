import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getWhitelist,
  addRegAllow,
  getEquipments,
  addEquipment,
  deleteEquipment,
  getAllUsers,
  updateUserRole,
} from "../api/adminApi";
import { createApiErrorMessage } from "../utils/errors";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import useMountedRef from "./useMountedRef";

export const useAdminDashboard = () => {
  const mountedRef = useMountedRef();

  const [whitelist, setWhitelist] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [whitelistSearch, setWhitelistSearch] = useState("");
  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [whitelistData, equipmentsData, usersData] = await Promise.all([
        getWhitelist(),
        getEquipments(),
        getAllUsers(),
      ]);
      
      if (mountedRef.current) {
        setWhitelist(whitelistData);
        setEquipments(equipmentsData);
        setUsers(usersData);
      }
    } catch (error) {
      showErrorToast(
        createApiErrorMessage(error, "Hiba az admin adatok betöltésekor."),
        "admin-fetch"
      );
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [mountedRef]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleUpdateRole = async (userId, newRole) => {
    setActionLoading(true);
    try {
      await updateUserRole(userId, newRole);
      showSuccessToast("Szerepkör módosítva.");
      await fetchAllData();
    } catch (error) {
      showErrorToast(createApiErrorMessage(error, "Sikertelen módosítás."), "admin-user-role");
    } finally {
      if (mountedRef.current) setActionLoading(false);
    }
  };

  const handleAddNeptun = async (neptunCode) => {
    if (!neptunCode.trim()) return false;
    setActionLoading(true);
    try {
      await addRegAllow(neptunCode.trim());
      showSuccessToast("Hozzáadva.");
      await fetchAllData();
      return true;
    } catch (error) {
      showErrorToast(createApiErrorMessage(error, "Hiba a hozzáadáskor."), "admin-whitelist-add");
      return false;
    } finally {
      if (mountedRef.current) setActionLoading(false);
    }
  };

  const handleAddEquipment = async (equipmentData) => {
    setActionLoading(true);
    try {
      await addEquipment(equipmentData);
      showSuccessToast("Eszköz hozzáadva.");
      await fetchAllData();
      return true;
    } catch (error) {
      showErrorToast(createApiErrorMessage(error, "Hiba a mentéskor."), "admin-equip-add");
      return false;
    } finally {
      if (mountedRef.current) setActionLoading(false);
    }
  };

  const handleDeleteEquipment = async (id) => {
    setActionLoading(true);
    try {
      await deleteEquipment(id);
      showSuccessToast("Eszköz törölve.");
      await fetchAllData();
    } catch (error) {
      showErrorToast(createApiErrorMessage(error, "Törlés sikertelen."), "admin-equip-delete");
    } finally {
      if (mountedRef.current) setActionLoading(false);
    }
  };

  const filteredWhitelist = useMemo(() => {
    return whitelist.filter(w => w.neptunCode.toLowerCase().includes(whitelistSearch.toLowerCase()));
  }, [whitelist, whitelistSearch]);

  const filteredEquipments = useMemo(() => {
    return equipments.filter(e => e.equipName.toLowerCase().includes(equipmentSearch.toLowerCase()));
  }, [equipments, equipmentSearch]);

  const filteredUsers = useMemo(() => {
    const term = userSearch.toLowerCase();
    return users.filter(u => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term));
  }, [users, userSearch]);

  return {
    whitelist: filteredWhitelist,
    equipments: filteredEquipments,
    users: filteredUsers,
    totalWhitelistCount: whitelist.length,
    totalEquipmentCount: equipments.length,
    totalUserCount: users.length,
    totalEquipmentValue: equipments.reduce((sum, e) => sum + e.equipCost, 0),
    loading,
    actionLoading,
    whitelistSearch,
    setWhitelistSearch,
    equipmentSearch,
    setEquipmentSearch,
    userSearch,
    setUserSearch,
    handleAddNeptun,
    handleAddEquipment,
    handleDeleteEquipment,
    handleUpdateRole,
  };
};