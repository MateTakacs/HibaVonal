import { useState } from "react";

const WhitelistManagerCard = ({
  list,
  onAdd,
  isLoading,
  searchQuery,
  onSearchChange,
}) => {
  const [neptun, setNeptun] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onAdd(neptun.toUpperCase());
    if (success) setNeptun("");
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h3 className="h5 mb-3">Regisztrációs fehérlista</h3>
        
        <form onSubmit={handleSubmit} className="mb-4 p-3 bg-light rounded-3">
          <div className="input-group input-group-sm">
            <input
              type="text"
              className="form-control"
              placeholder="Új Neptun-kód (pl. ABC123)"
              value={neptun}
              onChange={(e) => setNeptun(e.target.value)}
              required
              maxLength={6}
            />
            <button className="btn btn-primary" type="submit" disabled={isLoading}>
              Hozzáadás
            </button>
          </div>
        </form>

        <input
          type="text"
          className="form-control form-control-sm mb-3"
          placeholder="Keresés Neptun-kódra..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />

        <div className="table-responsive" style={{ maxHeight: "400px" }}>
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light sticky-top">
              <tr>
                <th>Neptun-kód</th>
                <th className="text-end">Státusz</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.neptunCode}>
                  <td className="fw-bold">{item.neptunCode}</td>
                  <td className="text-end">
                    {item.registered ? (
                      <span className="badge text-bg-success">Regisztrált</span>
                    ) : (
                      <span className="badge text-bg-secondary">Várakozik</span>
                    )}
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center text-muted py-3">Nincs találat.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WhitelistManagerCard;