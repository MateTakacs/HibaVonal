const LoadingCard = ({ text = "Betöltés..." }) => (
  <div className="card border-0 shadow-sm">
    <div className="card-body">{text}</div>
  </div>
);

export default LoadingCard;
