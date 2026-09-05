export default function EmptyState({ title = 'No data found', description = 'There is nothing to show right now.' }) {
  return (
    <div className="state-box empty-state">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}
