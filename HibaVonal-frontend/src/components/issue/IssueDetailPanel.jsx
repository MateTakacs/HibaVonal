import StatusBadge from "../common/StatusBadge";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL || "https://localhost:7218").replace(
    /\/+$/,
    "",
  );

const resolveIssueImageUrl = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") {
    return null;
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const normalizedPath = imagePath.startsWith("/")
    ? imagePath
    : `/${imagePath}`;

  return `${API_BASE_URL}${normalizedPath}`;
};

const IssueDetailPanel = ({
  issue,
  title = "Részletes nézet",
  extraAction,
}) => {
  const rawImagePath = issue?.assignedImage || issue?.issuePicPath;
  const issueImageUrl = resolveIssueImageUrl(rawImagePath);

  return (
    <div className="card border-0 shadow-sm mb-4 detail-panel-card">
      <div className="card-body detail-panel-body">
        <div className="d-flex justify-content-between align-items-center mb-3 gap-2">
          <h3 className="h5 mb-0">{title}</h3>
          {extraAction}
        </div>

        {!issue ? (
          <p className="text-secondary mb-0">
            Válassz ki egy hibajegyet a részletes nézethez.
          </p>
        ) : (
          <>
            <div className="d-flex flex-wrap gap-2 mb-3">
              <StatusBadge value={issue.status} />
              <StatusBadge value={issue.urgency} />
            </div>
            <dl className="detail-list mb-0">
              <div>
                <dt>Azonosító</dt>
                <dd>#{issue.id}</dd>
              </div>
              <div>
                <dt>Leírás</dt>
                <dd>{issue.description}</dd>
              </div>
              <div>
                <dt>Szoba</dt>
                <dd>{issue.roomNumber || "—"}</dd>
              </div>
              <div>
                <dt>Eszköz</dt>
                <dd>{issue.equipmentName || "—"}</dd>
              </div>
              <div>
                <dt>Bejelentő</dt>
                <dd>
                  {issue.reporterName || "—"}
                  {issue.reporterEmail ? ` (${issue.reporterEmail})` : ""}
                </dd>
              </div>
              <div>
                <dt>Kijelölt karbantartó</dt>
                <dd>{issue.assignedMaintainerName || "Nincs kiosztva"}</dd>
              </div>
              <div>
                <dt>Hozzárendelt kép</dt>
                <dd>
                  {issueImageUrl ? (
                    <img
                      src={issueImageUrl}
                      alt="Hozzárendelt kép"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        borderRadius: "4px",
                      }}
                    />
                  ) : (
                    "Nincs kép hozzárendelve"
                  )}
                </dd>
              </div>
            </dl>
          </>
        )}
      </div>
    </div>
  );
};

export default IssueDetailPanel;
