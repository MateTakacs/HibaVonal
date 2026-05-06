import { 
  useState 
} from "react";

import { 
  formatCurrency 
} from "../../utils/formatters";

const EquipmentManagerCard = ({ 
  equipments, 
  onAdd, 
  onDelete, 
  isLoading, 
  searchQuery, 
  onSearchChange 
}) => {
  const [
    newEquip, 
    setNewEquip
  ] = useState({ 
    equipName: "", 
    equipCost: "" 
  });

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    const payload = { 
      equipName: newEquip.equipName, 
      equipCost: Number(
        newEquip.equipCost
      ) 
    };

    const success = await onAdd(
      payload
    );

    if (success) {
      setNewEquip({ 
        equipName: "", 
        equipCost: "" 
      });
    }
  };

  return (
    <div 
      className="card border-0 shadow-sm h-100"
    >
      <div 
        className="card-body"
      >
        <h3 
          className="h5 mb-3"
        >
          Eszközök kezelése
        </h3>

        <form 
          onSubmit={handleSubmit} 
          className="mb-4 p-3 bg-light rounded-3"
        >
          <div 
            className="row g-2"
          >
            <div 
              className="col-md-6"
            >
              <input 
                type="text" 
                className="form-control form-control-sm" 
                placeholder="Eszköz neve" 
                value={newEquip.equipName} 
                onChange={(e) => 
                  setNewEquip({ 
                    ...newEquip, 
                    equipName: e.target.value 
                  })
                } 
                required 
              />
            </div>

            <div 
              className="col-md-4"
            >
              <input 
                type="number" 
                className="form-control form-control-sm" 
                placeholder="Ár" 
                value={newEquip.equipCost} 
                onChange={(e) => 
                  setNewEquip({ 
                    ...newEquip, 
                    equipCost: e.target.value 
                  })
                } 
                required 
              />
            </div>

            <div 
              className="col-md-2"
            >
              <button 
                type="submit" 
                className="btn btn-sm btn-primary w-100" 
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
          onChange={(e) => 
            onSearchChange(
              e.target.value
            )
          } 
        />

        <div 
          className="table-responsive" 
          style={{ 
            maxHeight: "300px" 
          }}
        >
          <table 
            className="table table-sm table-hover align-middle mb-0"
          >
            <thead>
              <tr>
                <th>
                  Név
                </th>
                <th>
                  Ár
                </th>
                <th 
                  className="text-end"
                >
                  Művelet
                </th>
              </tr>
            </thead>
            <tbody>
              {equipments.map((e) => (
                <tr 
                  key={e.id}
                >
                  <td>
                    {e.equipName}
                  </td>
                  <td>
                    {formatCurrency(
                      e.equipCost
                    )}
                  </td>
                  <td 
                    className="text-end"
                  >
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => 
                        onDelete(e.id)
                      } 
                      disabled={isLoading}
                    >
                      Törlés
                    </button>
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

export default EquipmentManagerCard;