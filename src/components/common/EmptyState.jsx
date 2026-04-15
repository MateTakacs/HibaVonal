const EmptyState = ({ title, description }) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body py-5 text-center">
      <h3 className="h5 mb-2">{title}</h3>
      <p className="text-secondary mb-0">{description}</p>
    </div>
  </div>
);

export default EmptyState;
