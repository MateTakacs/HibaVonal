import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getWhitelist,
  addRegAllow,
  getEquipments,
  addEquipment,
  deleteEquipment,
} from "../api/adminApi";
import { createApiErrorMessage } from "../utils/errors";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import useMountedRef from "./useMountedRef";

export const useAdminDashboard = () => {
  const mountedRef = useMountedRef();

  const [whitelist, setWhitelist] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [whitelistSearch, setWhitelistSearch] = useState("");
  const [equipmentSearch, setEquipmentSearch] = useState("");

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [whitelistData, equipmentsData] = await Promise.all([
        getWhitelist(),
        getEquipments(),
      ]);
      
      if (mountedRef.current) {
        setWhitelist(whitelistData);
        setEquipments(equipmentsData);
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

  const handleAddNeptun = async (neptunCode) => {
    if (!neptunCode.trim()) return false;
    setActionLoading(true);
    try {
      const response = await addRegAllow(neptunCode.trim());
      showSuccessToast(response.message || "Neptun-kód hozzáadva.");
      await fetchAllData();
      return true; 
    } catch (error) {
      showErrorToast(
        createApiErrorMessage(error, "Hiba a Neptun-kód hozzáadásakor."),
        "admin-whitelist-add"
      );
      return false;
    } finally {
      if (mountedRef.current) setActionLoading(false);
    }
  };


  const handleAddEquipment = async (equipmentData) => {
    if (!equipmentData.equipName.trim() || equipmentData.equipCost <= 0) return false;
    setActionLoading(true);
    try {
      const response = await addEquipment(equipmentData);
      showSuccessToast(response.message || "Eszköz sikeresen hozzáadva.");
      await fetchAllData();
      return true;
    } catch (error) {
      showErrorToast(
        createApiErrorMessage(error, "Hiba az eszköz hozzáadásakor."),
        "admin-equip-add"
      );
      return false;
    } finally {
      if (mountedRef.current) setActionLoading(false);
    }
  };

  const handleDeleteEquipment = async (id) => {
    setActionLoading(true);
    try {
      const response = await deleteEquipment(id);
      showSuccessToast(response.message || "Eszköz törölve.");
      await fetchAllData();
    } catch (error) {
      showErrorToast(
        createApiErrorMessage(error, "Az eszköz nem törölhető (talán használatban van)."),
        "admin-equip-delete"
      );
    } finally {
      if (mountedRef.current) setActionLoading(false);
    }
  };

 
  const filteredWhitelist = useMemo(() => {
    if (!whitelistSearch.trim()) return whitelist;
    return whitelist.filter(w => 
      w.neptunCode.toLowerCase().includes(whitelistSearch.toLowerCase())
    );
  }, [whitelist, whitelistSearch]);

  const filteredEquipments = useMemo(() => {
    if (!equipmentSearch.trim()) return equipments;
    return equipments.filter(e => 
      e.equipName.toLowerCase().includes(equipmentSearch.toLowerCase())
    );
  }, [equipments, equipmentSearch]);

  return {
    whitelist: filteredWhitelist,
    equipments: filteredEquipments,
    totalWhitelistCount: whitelist.length,
    totalEquipmentCount: equipments.length,
    totalEquipmentValue: equipments.reduce((sum, e) => sum + e.equipCost, 0),
    loading,
    actionLoading,
    whitelistSearch,
    setWhitelistSearch,
    equipmentSearch,
    setEquipmentSearch,
    handleAddNeptun,
    handleAddEquipment,
    handleDeleteEquipment,
    refreshData: fetchAllData
  };
};

export default useAdminDashboard;