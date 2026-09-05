export default function ErrorState({ message = 'Something went wrong. Please try again.' }) {
  return (
    <div className="state-box error-state">
      <h3>Something went wrong</h3>
      <p>{message}</p>
    </div>
  )
}
