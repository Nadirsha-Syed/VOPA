export default function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="state-box loading-state">
      <div className="spinner" aria-label="Loading" />
      <p>{message}</p>
    </div>
  )
}
