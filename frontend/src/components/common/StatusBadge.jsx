export default function StatusBadge({ status }) {
  const normalized = status?.toLowerCase().replace(/\s+/g, '-') || 'default'

  const colorMap = {
    'performing-well': 'badge-success',
    improving: 'badge-warning',
    'needs-attention': 'badge-danger',
    active: 'badge-success',
    inactive: 'badge-muted',
    published: 'badge-success',
    draft: 'badge-warning',
    enabled: 'badge-success',
    disabled: 'badge-muted',
    default: 'badge-muted',
  }

  return <span className={`status-badge ${colorMap[normalized] || 'badge-muted'}`}>{status}</span>
}
