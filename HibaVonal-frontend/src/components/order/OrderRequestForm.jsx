import { SEEDED_TOOL_OPTIONS } from "../../constants/toolOptions";
import { formatCurrency } from "../../utils/formatters";

const OrderRequestForm = ({
  title,
  description,
  form,
  isSubmitting,
  submitLabel,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body">
        <h3 className="h5 mb-3">{title}</h3>
        <p className="text-secondary small">{description}</p>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Eszköz</label>
            <select
              className="form-select"
              value={form.toolListId}
              onChange={(event) => onChange("toolListId", event.target.value)}
            >
              {SEEDED_TOOL_OPTIONS.map((tool) => (
                <option key={tool.id} value={tool.id}>
                  #{tool.id} - {tool.label} ({formatCurrency(tool.price)})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Szállítási dátum</label>
            <input
              type="datetime-local"
              className="form-control"
              value={form.deliveryDate}
              onChange={(event) => onChange("deliveryDate", event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Mentés..." : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderRequestForm;
