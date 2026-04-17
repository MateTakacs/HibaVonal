const InfoMetric = ({ label, value, helper }) => (
  <div className="card border-0 shadow-sm metric-card h-100">
    <div className="card-body">
      <div className="text-secondary small mb-2">{label}</div>
      <div className="display-6 fw-semibold mb-1">{value}</div>
      {helper ? <div className="small text-secondary">{helper}</div> : null}
    </div>
  </div>
);

export default InfoMetric;
