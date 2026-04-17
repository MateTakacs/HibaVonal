import { useCallback, useEffect, useMemo, useState } from "react";
import {
  assignIssueToMaintainer,
  createLeadMaintainerOrder,
  getLeadMaintainerIssueById,
  getLeadMaintainerIssues,
  getLeadMaintainerOrders,
  getMaintainers,
  updateLeadMaintainerIssueStatus,
  updateLeadMaintainerOrderStatus,
} from "../api/maintenanceApi";
import { createApiErrorMessage } from "../utils/errors";
import { showErrorToast, showSuccessToast } from "../utils/toast";
import {
  filterBySearch,
  getIssueSearchText,
  getOrderSearchText,
  groupCountBy,
} from "../utils/search";
import useIssueSelection from "./useIssueSelection";
import useMountedRef from "./useMountedRef";
import useOrderRequestForm from "./useOrderRequestForm";

const toIsoDateString = (value) => {
  if (!value) return null;

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate.toISOString();
};

export const useLeadMaintainerDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [orders, setOrders] = useState([]);
  const [maintainers, setMaintainers] = useState([]);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [maintainersLoading, setMaintainersLoading] = useState(true);
  const [mutatingIssueId, setMutatingIssueId] = useState(null);
  const [mutatingOrderId, setMutatingOrderId] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [issueFilter, setIssueFilter] = useState("");
  const [onlyUnassigned, setOnlyUnassigned] = useState(false);
  const [issueSearch, setIssueSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const [assignFormByIssueId, setAssignFormByIssueId] = useState({});
  const mountedRef = useMountedRef();

  const {
    selectedIssueId,
    selectedIssue,
    selectIssue,
    syncSelectionWithList,
    loadSelectedIssue,
    refreshSelectedIssue,
  } = useIssueSelection(getLeadMaintainerIssueById);

  const { orderForm, updateOrderFormField, resetOrderDeliveryDate } =
    useOrderRequestForm();

  const loadIssues = useCallback(async () => {
    try {
      if (mountedRef.current) {
        setIssuesLoading(true);
      }

      const data = await getLeadMaintainerIssues({
        status: issueFilter || undefined,
        onlyUnassigned,
      });

      if (!mountedRef.current) {
        return data;
      }

      setIssues(data);
      syncSelectionWithList(data);

      setAssignFormByIssueId((current) => {
        const next = { ...current };

        data.forEach((issue) => {
          next[issue.id] = issue.assignedMaintainerId
            ? String(issue.assignedMaintainerId)
            : next[issue.id] || "";
        });

        return next;
      });

      return data;
    } catch (error) {
      showErrorToast(
        createApiErrorMessage(error, "A hibajegyek betöltése nem sikerült."),
        "lead-issues-load",
      );
      return [];
    } finally {
      if (mountedRef.current) {
        setIssuesLoading(false);
      }
    }
  }, [issueFilter, mountedRef, onlyUnassigned, syncSelectionWithList]);

  const loadOrders = useCallback(async () => {
    try {
      if (mountedRef.current) {
        setOrdersLoading(true);
      }

      const data = await getLeadMaintainerOrders({
        status: orderFilter || undefined,
      });

      if (!mountedRef.current) {
        return data;
      }

      setOrders(data);
      return data;
    } catch (error) {
      showErrorToast(
        createApiErrorMessage(error, "A rendelések betöltése nem sikerült."),
        "lead-orders-load",
      );
      return [];
    } finally {
      if (mountedRef.current) {
        setOrdersLoading(false);
      }
    }
  }, [mountedRef, orderFilter]);

  const loadMaintainers = useCallback(async () => {
    try {
      if (mountedRef.current) {
        setMaintainersLoading(true);
      }

      const data = await getMaintainers();

      if (!mountedRef.current) {
        return data;
      }

      setMaintainers(data);
      return data;
    } catch (error) {
      showErrorToast(
        createApiErrorMessage(error, "A karbantartók listája nem tölthető be."),
        "lead-maintainers-load",
      );
      return [];
    } finally {
      if (mountedRef.current) {
        setMaintainersLoading(false);
      }
    }
  }, [mountedRef]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    loadMaintainers();
  }, [loadMaintainers]);

  const handleSelectIssue = useCallback(
    async (issueId) => selectIssue(issueId),
    [selectIssue],
  );

  const handleAssignFormChange = useCallback((issueId, value) => {
    setAssignFormByIssueId((current) => ({ ...current, [issueId]: value }));
  }, []);

  const handleAssignIssue = useCallback(
    async (issueId) => {
      const maintainerId = assignFormByIssueId[issueId];

      if (!maintainerId) {
        showErrorToast(
          "Válassz karbantartót a kiosztáshoz.",
          "lead-assign-validation",
        );
        return;
      }

      try {
        if (mountedRef.current) {
          setMutatingIssueId(issueId);
        }

        const response = await assignIssueToMaintainer(issueId, maintainerId);
        showSuccessToast(response.message || "A hibajegy kiosztása sikerült.");
        await Promise.all([loadIssues(), loadSelectedIssue(issueId)]);
      } catch (error) {
        showErrorToast(
          createApiErrorMessage(error, "A hibajegy kiosztása nem sikerült."),
          "lead-issue-assign",
        );
      } finally {
        if (mountedRef.current) {
          setMutatingIssueId(null);
        }
      }
    },
    [assignFormByIssueId, loadIssues, loadSelectedIssue, mountedRef],
  );

  const handleIssueStatusUpdate = useCallback(
    async (issueId, status) => {
      try {
        if (mountedRef.current) {
          setMutatingIssueId(issueId);
        }

        const response = await updateLeadMaintainerIssueStatus(issueId, status);
        showSuccessToast(response.message || "A hibajegy státusza frissítve.");
        await Promise.all([loadIssues(), loadSelectedIssue(issueId)]);
      } catch (error) {
        showErrorToast(
          createApiErrorMessage(error, "A hibajegy státusza nem frissíthető."),
          "lead-issue-status",
        );
      } finally {
        if (mountedRef.current) {
          setMutatingIssueId(null);
        }
      }
    },
    [loadIssues, loadSelectedIssue, mountedRef],
  );

  const handleCreateOrder = useCallback(
    async (event) => {
      event.preventDefault();

      const deliveryDateIso = toIsoDateString(orderForm.deliveryDate);

      if (!orderForm.toolListId || !deliveryDateIso) {
        showErrorToast(
          "Adj meg érvényes eszközt és szállítási dátumot.",
          "lead-order-validation",
        );
        return;
      }

      try {
        if (mountedRef.current) {
          setCreatingOrder(true);
        }

        const response = await createLeadMaintainerOrder({
          toolListId: Number(orderForm.toolListId),
          deliveryDate: deliveryDateIso,
        });
        showSuccessToast(response.message || "A rendelés létrejött.");
        resetOrderDeliveryDate();
        await loadOrders();
      } catch (error) {
        showErrorToast(
          createApiErrorMessage(error, "A rendelés létrehozása nem sikerült."),
          "lead-order-create",
        );
      } finally {
        if (mountedRef.current) {
          setCreatingOrder(false);
        }
      }
    },
    [
      loadOrders,
      mountedRef,
      orderForm.deliveryDate,
      orderForm.toolListId,
      resetOrderDeliveryDate,
    ],
  );

  const handleOrderStatusUpdate = useCallback(
    async (orderId, status) => {
      try {
        if (mountedRef.current) {
          setMutatingOrderId(orderId);
        }

        const response = await updateLeadMaintainerOrderStatus(orderId, status);
        showSuccessToast(response.message || "A rendelés állapota frissítve.");
        await loadOrders();
      } catch (error) {
        showErrorToast(
          createApiErrorMessage(
            error,
            "A rendelés státuszát nem sikerült frissíteni.",
          ),
          "lead-order-status",
        );
      } finally {
        if (mountedRef.current) {
          setMutatingOrderId(null);
        }
      }
    },
    [loadOrders, mountedRef],
  );

  const handleRefreshAll = useCallback(async () => {
    await Promise.allSettled([
      loadIssues(),
      loadOrders(),
      loadMaintainers(),
      refreshSelectedIssue(),
    ]);
  }, [loadIssues, loadMaintainers, loadOrders, refreshSelectedIssue]);

  const issueCounts = useMemo(() => groupCountBy(issues, "status"), [issues]);
  const orderCounts = useMemo(() => groupCountBy(orders, "status"), [orders]);
  const unassignedCount = useMemo(
    () => issues.filter((issue) => !issue.assignedMaintainerId).length,
    [issues],
  );
  const filteredIssues = useMemo(
    () => filterBySearch(issues, issueSearch, getIssueSearchText),
    [issues, issueSearch],
  );
  const filteredOrders = useMemo(
    () => filterBySearch(orders, orderSearch, getOrderSearchText),
    [orders, orderSearch],
  );

  return {
    issues,
    orders,
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
    issueCounts,
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
    handleOrderFormChange: updateOrderFormField,
    handleOrderStatusUpdate,
    handleRefreshAll,
    loadIssues,
    loadOrders,
    loadMaintainers,
  };
};

export default useLeadMaintainerDashboard;
