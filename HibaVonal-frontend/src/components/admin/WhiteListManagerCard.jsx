import { useState } from "react";

const WhitelistManagerCard = ({ list, onAdd, isLoading, searchQuery, onSearchChange }) => {
  const [neptun, setNeptun] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onAdd(neptun.toUpperCase());
    if (success) setNeptun("");
  };

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <h3 className="h5 mb-3">Fehérlista</h3>
        
       <form onSubmit={handleSubmit} className="mb-4 p-3 bg-light rounded-3">
  <div className="row g-2">
   
    <div className="col-md-10"> 
      <input 
        type="text" 
        className="form-control form-control-sm" 
        placeholder="Neptun-kód" 
        value={neptun} 
        onChange={(e) => setNeptun(e.target.value)} 
        required 
        maxLength={6} 
      />
    </div>
    
    
    <div className="col-md-2"> 
      <button 
        className="btn btn-sm btn-primary w-100" 
        type="submit" 
        disabled={isLoading}
      >
        Hozzáadás
      </button>
    </div>
  </div>
</form>
       

        <input 
          type="text" 
          className="form-control form-control-sm mb-3" 
          placeholder="Keresés..." 
          value={searchQuery} 
          onChange={(e) => onSearchChange(e.target.value)} 
        />
        
        <div className="table-responsive" style={{ maxHeight: "300px" }}>
          <table className="table table-sm table-hover align-middle mb-0">
            <thead>
              <tr>
                <th>Kód</th>
                <th className="text-end">Státusz</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item.neptunCode}>
                  <td>{item.neptunCode}</td>
                  <td className="text-end">
                    {item.registered ? (
                      <span className="badge bg-success">Kész</span>
                    ) : (
                      <span className="badge bg-secondary">Vár</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WhitelistManagerCard;