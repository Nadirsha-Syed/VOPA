export default function ChartCard({ title, children, action }) {
  return (
    <div className="chart-card">
      <div className="chart-card-header">
        <h3>{title}</h3>
        {action ? <div>{action}</div> : null}
      </div>
      <div className="chart-card-body">{children}</div>
    </div>
  )
}
