import { useState } from "react";
import { ROLES, ROLE_LABELS } from "../../constants/roles";

const UserManagerCard = ({ users, onUpdateRole, isLoading, searchQuery, onSearchChange }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <h3 className="h5 mb-3">Felhasználók kezelése</h3>
        
        <input 
          type="text" 
          className="form-control form-control-sm mb-3" 
          placeholder="Keresés név vagy email alapján..." 
          value={searchQuery} 
          onChange={(e) => onSearchChange(e.target.value)} 
        />
        
        <div className="table-responsive" style={{ maxHeight: "400px" }}>
          <table className="table table-sm table-hover align-middle mb-0">
            <thead className="table-light sticky-top">
              <tr>
                <th>Név / Email</th>
                <th>Szerepkör</th>
                <th className="text-end">Műveletek</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="fw-semibold">{user.name}</div>
                    <div className="small text-muted">{user.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${user.role === ROLES.ADMIN ? 'bg-danger' : user.role === ROLES.MAINTAINER ? 'bg-warning text-dark' : 'bg-info'}`}>
                      {ROLE_LABELS[user.role]}
                    </span>
                  </td>
                  <td className="text-end">
            
                    <button 
                      className="btn btn-sm btn-outline-secondary me-2"
                      onClick={() => setSelectedUser(user)}
                    >
                      Adatlap
                    </button>
                    
                    <select 
                      className="form-select form-select-sm d-inline-block w-auto" 
                      value={user.role} 
                      onChange={(e) => onUpdateRole(user.id, e.target.value)} 
                      disabled={isLoading}
                    >
                      {Object.keys(ROLES).map(k => (
                        <option key={ROLES[k]} value={ROLES[k]}>{ROLE_LABELS[ROLES[k]]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    
      {selectedUser && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title">
                  {selectedUser.name} adatlapja
                </h5>
                <button type="button" className="btn-close" onClick={() => setSelectedUser(null)}></button>
              </div>
              <div className="modal-body">
                <ul className="list-group list-group-flush mb-3">
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span>Email cím:</span>
                    <strong>{selectedUser.email}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span>Szerepkör:</span>
                    <span className="badge bg-primary">{ROLE_LABELS[selectedUser.role]}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span>Szobaszám:</span>
                    <strong>{selectedUser.roomNum ? `${selectedUser.roomNum}. szoba` : "Nincs megadva"}</strong>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <span>Bejelentett hibák (összesen):</span>
                    <span className="badge bg-danger rounded-pill">{selectedUser.reportedIssuesCount} db</span>
                  </li>
                  
                  {(selectedUser.role === ROLES.MAINTAINER || selectedUser.role === ROLES.LEAD_MAINTAINER) && (
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      <span>Kiosztott feladatok (karbantartóként):</span>
                      <span className="badge bg-warning text-dark rounded-pill">{selectedUser.assignedIssuesCount} db</span>
                    </li>
                  )}
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary w-100" onClick={() => setSelectedUser(null)}>
                  Bezárás
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagerCard;