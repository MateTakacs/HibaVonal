import { useCallback, useEffect, useRef, useState } from "react";
import { createApiErrorMessage } from "../utils/errors";
import { showErrorToast } from "../utils/toast";
import useMountedRef from "./useMountedRef";

export const useIssueSelection = (fetchIssueById, errorMessage = "A hibajegy részletei nem tölthetők be.") => {
  const [selectedIssueId, setSelectedIssueId] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const selectedIssueIdRef = useRef(null);
  const latestRequestIdRef = useRef(0);
  const mountedRef = useMountedRef();

  useEffect(() => {
    selectedIssueIdRef.current = selectedIssueId;
  }, [selectedIssueId]);

  const loadSelectedIssue = useCallback(
    async (issueId) => {
      const requestId = latestRequestIdRef.current + 1;
      latestRequestIdRef.current = requestId;

      if (!issueId) {
        if (mountedRef.current) {
          setSelectedIssue(null);
        }
        return null;
      }

      try {
        const detailedIssue = await fetchIssueById(issueId);

        if (!mountedRef.current || latestRequestIdRef.current !== requestId) {
          return detailedIssue;
        }

        setSelectedIssue(detailedIssue);
        return detailedIssue;
      } catch (error) {
        if (mountedRef.current && latestRequestIdRef.current === requestId) {
          setSelectedIssue(null);
        }

        showErrorToast(createApiErrorMessage(error, errorMessage), "issue-detail-load");
        return null;
      }
    },
    [errorMessage, fetchIssueById, mountedRef],
  );

  const selectIssue = useCallback(
    async (issueId) => {
      setSelectedIssueId(issueId);
      return loadSelectedIssue(issueId);
    },
    [loadSelectedIssue],
  );

  const clearSelection = useCallback(() => {
    setSelectedIssueId(null);
    setSelectedIssue(null);
  }, []);

  const syncSelectionWithList = useCallback(
    (items) => {
      const currentSelectedIssueId = selectedIssueIdRef.current;

      if (!currentSelectedIssueId) {
        return;
      }

      const stillExists = items.some((item) => item.id === currentSelectedIssueId);

      if (!stillExists) {
        clearSelection();
      }
    },
    [clearSelection],
  );

  const refreshSelectedIssue = useCallback(async () => loadSelectedIssue(selectedIssueIdRef.current), [loadSelectedIssue]);

  return {
    selectedIssueId,
    selectedIssue,
    selectIssue,
    clearSelection,
    syncSelectionWithList,
    refreshSelectedIssue,
    loadSelectedIssue,
  };
};

export default useIssueSelection;
