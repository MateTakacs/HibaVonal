import InfoMetric from "../common/InfoMetric";

const DashboardMetricsRow = ({ metrics }) => (
  <div className="row g-4 mb-4">
    {metrics.map((metric) => (
      <div key={metric.label} className={metric.columnClassName || "col-md-3"}>
        <InfoMetric label={metric.label} value={metric.value} helper={metric.helper} />
      </div>
    ))}
  </div>
);

export default DashboardMetricsRow;
