import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getMyFeedbacks, createFeedback } from "../../api/feedbackApi";
import { getMyIssues } from "../../api/issueApi";

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ issueId: "", comment: "" });

  const fetchData = async () => {
    try {
      const [feedbackData, issueData] = await Promise.all([
        getMyFeedbacks(),
        getMyIssues(),
      ]);
      setFeedbacks(feedbackData);
      setResolvedIssues(issueData.filter((i) => i.status === "Resolved"));
    } catch {
      toast.error("Hiba az adatok betöltésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFeedback({
        issueId: parseInt(form.issueId),
        comment: form.comment,
      });
      toast.success("Visszajelzés sikeresen elküldve!");
      setShowModal(false);
      setForm({ issueId: "", comment: "" });
      fetchData();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Hiba a visszajelzés küldésekor.",
      );
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Visszajelzéseim</h5>
        {resolvedIssues.length > 0 && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => setShowModal(true)}
          >
            + Új visszajelzés
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="alert alert-info">Még nincs visszajelzésed.</div>
      ) : (
        <div className="card border-0 shadow-sm">
          <ul className="list-group list-group-flush">
            {feedbacks.map((fb) => (
              <li key={fb.id} className="list-group-item">
                <div style={{ fontSize: 14 }}>{fb.comment}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>
                  {new Date(fb.createdAt).toLocaleDateString("hu-HU")} · #
                  {fb.issueId}. hiba
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Visszajelzés modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Új visszajelzés</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">
                      Javított hiba kiválasztása
                    </label>
                    <select
                      className="form-select"
                      required
                      value={form.issueId}
                      onChange={(e) =>
                        setForm({ ...form, issueId: e.target.value })
                      }
                    >
                      <option value="">Válassz hibát...</option>
                      {resolvedIssues.map((issue) => (
                        <option key={issue.id} value={issue.id}>
                          #{issue.id} - {issue.description.substring(0, 50)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Megjegyzés</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      required
                      value={form.comment}
                      onChange={(e) =>
                        setForm({ ...form, comment: e.target.value })
                      }
                      placeholder="Írd le a visszajelzésedet..."
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Mégse
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Küldés
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
