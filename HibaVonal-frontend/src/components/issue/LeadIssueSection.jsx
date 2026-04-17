import LeadIssueActions from "./LeadIssueActions";
import IssueFilterToolbar from "./IssueFilterToolbar";
import IssueListContent from "./IssueListContent";

const LeadIssueSection = ({
  issueFilter,
  onlyUnassigned,
  issueSearch,
  onIssueFilterChange,
  onOnlyUnassignedChange,
  onIssueSearchChange,
  issues,
  selectedIssueId,
  issuesLoading,
  maintainers,
  maintainersLoading,
  assignFormByIssueId,
  mutatingIssueId,
  onSelectIssue,
  onAssignFormChange,
  onAssignIssue,
  onChangeIssueStatus,
}) => (
  <>
    <IssueFilterToolbar
      title="Hibajegy központ"
      description="Szűrés, keresés, kiosztás és státuszkezelés."
      issueFilter={issueFilter}
      onlyUnassigned={onlyUnassigned}
      issueSearch={issueSearch}
      onIssueFilterChange={onIssueFilterChange}
      onOnlyUnassignedChange={onOnlyUnassignedChange}
      onIssueSearchChange={onIssueSearchChange}
      showOnlyUnassigned
      searchPlaceholder="pl. radiátor, maintainer1"
    />

    <IssueListContent
      issues={issues}
      selectedIssueId={selectedIssueId}
      loading={issuesLoading}
      loadingText="Hibajegyek betöltése..."
      emptyTitle="Nincs találat"
      emptyDescription="Próbálj más státuszt, keresést vagy vedd ki a kiosztatlan szűrőt."
      onSelect={onSelectIssue}
      renderActions={(issue) => (
        <LeadIssueActions
          issue={issue}
          maintainers={maintainers}
          assignValue={assignFormByIssueId[issue.id]}
          maintainersLoading={maintainersLoading}
          isLoading={mutatingIssueId === issue.id}
          onAssignValueChange={onAssignFormChange}
          onAssign={onAssignIssue}
          onChangeStatus={onChangeIssueStatus}
        />
      )}
    />
  </>
);

export default LeadIssueSection;
