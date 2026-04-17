import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  getMyIssues,
  createIssue,
  updateIssue,
  getEquipmentsByRoom,
} from "../../api/issueApi";

const statusLabel = {
  Open: { label: "Nyitott", cls: "bg-warning text-dark" },
  InProgress: { label: "Folyamatban", cls: "bg-info text-white" },
  Resolved: { label: "Javított", cls: "bg-success text-white" },
  Closed: { label: "Lezárt", cls: "bg-secondary text-white" },
};

const urgencyLabel = {
  0: "Alacsony",
  1: "Közepes",
  2: "Magas",
  Low: "Alacsony",
  Medium: "Közepes",
  High: "Magas",
};

const urgencyToNumber = {
  Low: 0,
  Medium: 1,
  High: 2,
};

const IssuesPage = ({ onStatsRefresh }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [equipments, setEquipments] = useState([]);
  const [equipmentsLoading, setEquipmentsLoading] = useState(false);

  const [createForm, setCreateForm] = useState({
    description: "",
    urgency: 0,
    roomNum: "",
    equipmentId: "",
  });
  const [editForm, setEditForm] = useState({ description: "", urgency: 0 });

  const fetchIssues = async () => {
    try {
      const data = await getMyIssues();
      setIssues(data);
    } catch {
      toast.error("Hiba a bejelentések betöltésekor.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // Berendezések betöltése amikor a szobaszám változik
  useEffect(() => {
    const fetchEquipments = async () => {
      if (!createForm.roomNum) {
        setEquipments([]);
        return;
      }
      setEquipmentsLoading(true);
      try {
        const data = await getEquipmentsByRoom(parseInt(createForm.roomNum));
        setEquipments(data);
      } catch {
        setEquipments([]);
      } finally {
        setEquipmentsLoading(false);
      }
    };

    const timer = setTimeout(fetchEquipments, 500);
    return () => clearTimeout(timer);
  }, [createForm.roomNum]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createIssue({
        description: createForm.description,
        urgency: parseInt(createForm.urgency),
        roomNum: parseInt(createForm.roomNum),
        equipmentId: createForm.equipmentId
          ? parseInt(createForm.equipmentId)
          : null,
      });
      toast.success("Hibabejelentés sikeresen létrehozva!");
      setShowCreateModal(false);
      setCreateForm({
        description: "",
        urgency: 0,
        roomNum: "",
        equipmentId: "",
      });
      setEquipments([]);
      await fetchIssues();
      onStatsRefresh?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Hiba a bejelentés során.");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      await updateIssue(selectedIssue.id, {
        description: editForm.description,
        urgency: parseInt(editForm.urgency),
      });
      toast.success("Hibabejelentés sikeresen módosítva!");
      setShowEditModal(false);
      await fetchIssues();
      onStatsRefresh?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Hiba a módosítás során.");
    }
  };

  const openEdit = (issue) => {
    setSelectedIssue(issue);
    const urgencyNum =
      typeof issue.urgency === "string"
        ? (urgencyToNumber[issue.urgency] ?? 0)
        : issue.urgency;
    setEditForm({ description: issue.description, urgency: urgencyNum });
    setShowEditModal(true);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Hibabejelentések</h5>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowCreateModal(true)}
        >
          + Új bejelentés
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : issues.length === 0 ? (
        <div className="alert alert-info">Még nincs hibabejelentésed.</div>
      ) : (
        <div className="card border-0 shadow-sm">
          <ul className="list-group list-group-flush">
            {issues.map((issue) => (
              <li
                key={issue.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>
                    {issue.description}
                  </div>
                  <div className="text-muted" style={{ fontSize: 12 }}>
                    {new Date(issue.reportDate).toLocaleDateString("hu-HU")} ·{" "}
                    {urgencyLabel[issue.urgency] ?? issue.urgency} sürgősség
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span
                    className={`badge ${statusLabel[issue.status]?.cls ?? "bg-secondary"}`}
                  >
                    {statusLabel[issue.status]?.label ?? issue.status}
                  </span>
                  {issue.status === "Open" && (
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => openEdit(issue)}
                    >
                      Módosítás
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Új bejelentés modal */}
      {showCreateModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Új hibabejelentés</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEquipments([]);
                  }}
                />
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Leírás</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      required
                      value={createForm.description}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="Írd le a hibát..."
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sürgősség</label>
                    <select
                      className="form-select"
                      value={createForm.urgency}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          urgency: e.target.value,
                        })
                      }
                    >
                      <option value={0}>Alacsony</option>
                      <option value={1}>Közepes</option>
                      <option value={2}>Magas</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Szobaszám</label>
                    <input
                      type="number"
                      className="form-control"
                      required
                      value={createForm.roomNum}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          roomNum: e.target.value,
                          equipmentId: "",
                        })
                      }
                      placeholder="pl. 101"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      Berendezés{" "}
                      <span className="text-muted">(opcionális)</span>
                    </label>
                    <select
                      className="form-select"
                      value={createForm.equipmentId}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          equipmentId: e.target.value,
                        })
                      }
                      disabled={!createForm.roomNum || equipmentsLoading}
                    >
                      <option value="">
                        {equipmentsLoading
                          ? "Betöltés..."
                          : equipments.length === 0 && createForm.roomNum
                            ? "Nincs berendezés ebben a szobában"
                            : "Válassz berendezést..."}
                      </option>
                      {equipments.map((eq) => (
                        <option key={eq.id} value={eq.id}>
                          {eq.id} - {eq.name}
                        </option>
                      ))}
                    </select>
                    {!createForm.roomNum && (
                      <div className="form-text">
                        Előbb add meg a szobaszámot!
                      </div>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEquipments([]);
                    }}
                  >
                    Mégse
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Beküldés
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Módosítás modal */}
      {showEditModal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.4)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Hibabejelentés módosítása</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowEditModal(false)}
                />
              </div>
              <form onSubmit={handleEdit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Leírás</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      required
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Sürgősség</label>
                    <select
                      className="form-select"
                      value={editForm.urgency}
                      onChange={(e) =>
                        setEditForm({ ...editForm, urgency: e.target.value })
                      }
                    >
                      <option value={0}>Alacsony</option>
                      <option value={1}>Közepes</option>
                      <option value={2}>Magas</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Mégse
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Mentés
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

export default IssuesPage;
