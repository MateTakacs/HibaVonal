import { useCallback, useEffect, useMemo, useState } from "react";
import {
  createMaintainerOrder,
  getMaintainerIssueById,
  getMaintainerIssues,
  getMaintainerOrders,
  updateMaintainerIssueStatus,
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

export const useMaintainerDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [orders, setOrders] = useState([]);
  const [issuesLoading, setIssuesLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [mutatingIssueId, setMutatingIssueId] = useState(null);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [issueFilter, setIssueFilter] = useState("");
  const [issueSearch, setIssueSearch] = useState("");
  const [orderFilter, setOrderFilter] = useState("");
  const [orderSearch, setOrderSearch] = useState("");
  const mountedRef = useMountedRef();

  const {
    selectedIssueId,
    selectedIssue,
    selectIssue,
    syncSelectionWithList,
    loadSelectedIssue,
  } = useIssueSelection(getMaintainerIssueById);

  const { orderForm, updateOrderFormField, resetOrderDeliveryDate } =
    useOrderRequestForm();

  const loadIssues = useCallback(async () => {
    try {
      if (mountedRef.current) {
        setIssuesLoading(true);
      }

      const data = await getMaintainerIssues({
        status: issueFilter || undefined,
      });

      if (!mountedRef.current) {
        return data;
      }

      setIssues(data);
      syncSelectionWithList(data);
      return data;
    } catch (error) {
      showErrorToast(
        createApiErrorMessage(error, "A hibajegyek betöltése nem sikerült."),
        "maintainer-issues-load",
      );
      return [];
    } finally {
      if (mountedRef.current) {
        setIssuesLoading(false);
      }
    }
  }, [issueFilter, mountedRef, syncSelectionWithList]);

  const loadOrders = useCallback(async () => {
    try {
      if (mountedRef.current) {
        setOrdersLoading(true);
      }

      const data = await getMaintainerOrders({
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
        "maintainer-orders-load",
      );
      return [];
    } finally {
      if (mountedRef.current) {
        setOrdersLoading(false);
      }
    }
  }, [mountedRef, orderFilter]);

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleSelectIssue = useCallback(
    async (issueId) => selectIssue(issueId),
    [selectIssue],
  );

  const handleIssueStatusUpdate = useCallback(
    async (issueId, status) => {
      try {
        if (mountedRef.current) {
          setMutatingIssueId(issueId);
        }

        const response = await updateMaintainerIssueStatus(issueId, status);
        showSuccessToast(response.message || "A hibajegy státusza frissült.");
        await Promise.all([loadIssues(), loadSelectedIssue(issueId)]);
      } catch (error) {
        showErrorToast(
          createApiErrorMessage(error, "A státusz frissítése nem sikerült."),
          "maintainer-issue-status",
        );
      } finally {
        if (mountedRef.current) {
          setMutatingIssueId(null);
        }
      }
    },
    [loadIssues, loadSelectedIssue, mountedRef],
  );

  const handleOrderSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      const deliveryDateIso = toIsoDateString(orderForm.deliveryDate);

      if (!orderForm.toolListId || !deliveryDateIso) {
        showErrorToast(
          "Adj meg érvényes eszközt és szállítási dátumot.",
          "maintainer-order-validation",
        );
        return;
      }

      try {
        if (mountedRef.current) {
          setCreatingOrder(true);
        }

        const response = await createMaintainerOrder({
          toolListId: Number(orderForm.toolListId),
          deliveryDate: deliveryDateIso,
        });
        showSuccessToast(
          response.message || "A rendelési igény rögzítve lett.",
        );
        resetOrderDeliveryDate();
        await loadOrders();
      } catch (error) {
        showErrorToast(
          createApiErrorMessage(
            error,
            "A rendelési igény létrehozása nem sikerült.",
          ),
          "maintainer-order-create",
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

  const issueCounts = useMemo(() => groupCountBy(issues, "status"), [issues]);
  const orderCounts = useMemo(() => groupCountBy(orders, "status"), [orders]);
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
    orderCounts,
    filteredIssues,
    filteredOrders,
    setIssueFilter,
    setIssueSearch,
    setOrderFilter,
    setOrderSearch,
    handleSelectIssue,
    handleIssueStatusUpdate,
    handleOrderSubmit,
    handleOrderFormChange: updateOrderFormField,
    loadIssues,
    loadOrders,
  };
};

export default useMaintainerDashboard;
