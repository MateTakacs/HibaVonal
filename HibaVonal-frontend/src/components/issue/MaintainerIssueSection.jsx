import MaintainerIssueActions from "./MaintainerIssueActions";
import IssueFilterToolbar from "./IssueFilterToolbar";
import IssueListContent from "./IssueListContent";

const MaintainerIssueSection = ({
  issueFilter,
  issueSearch,
  onIssueFilterChange,
  onIssueSearchChange,
  issues,
  selectedIssueId,
  issuesLoading,
  mutatingIssueId,
  onSelectIssue,
  onChangeIssueStatus,
}) => (
  <>
    <IssueFilterToolbar
      title="Hibajegyek"
      description="Szűrés, keresés, részletek és státuszváltás."
      issueFilter={issueFilter}
      issueSearch={issueSearch}
      onIssueFilterChange={onIssueFilterChange}
      onIssueSearchChange={onIssueSearchChange}
      searchPlaceholder="pl. lámpa, 101"
    />

    <IssueListContent
      issues={issues}
      selectedIssueId={selectedIssueId}
      loading={issuesLoading}
      loadingText="Hibajegyek betöltése..."
      emptyTitle="Nincs megjeleníthető hibajegy"
      emptyDescription="Próbálj másik szűrőt vagy keresőkifejezést."
      onSelect={onSelectIssue}
      renderActions={(issue) => (
        <MaintainerIssueActions
          issue={issue}
          isLoading={mutatingIssueId === issue.id}
          onChangeStatus={onChangeIssueStatus}
        />
      )}
    />
  </>
);

export default MaintainerIssueSection;
