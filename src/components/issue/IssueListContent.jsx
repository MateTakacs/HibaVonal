import EmptyState from "../common/EmptyState";
import LoadingCard from "../common/LoadingCard";
import IssueCard from "./IssueCard";

const IssueListContent = ({
  issues,
  selectedIssueId,
  loading,
  loadingText,
  emptyTitle,
  emptyDescription,
  onSelect,
  renderActions,
}) => {
  if (loading) {
    return <LoadingCard text={loadingText} />;
  }

  if (issues.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="d-grid gap-3">
      {issues.map((issue) => (
        <IssueCard
          key={issue.id}
          issue={issue}
          isSelected={selectedIssueId === issue.id}
          onSelect={onSelect}
          actions={renderActions(issue)}
        />
      ))}
    </div>
  );
};

export default IssueListContent;
