export default function FilterBar({ filters = [], className = '' }) {
  return (
    <div className={`filter-bar ${className}`.trim()}>
      {filters.map((filter) => (
        <label key={filter.name} className="filter-item">
          <span>{filter.label}</span>
          <select value={filter.value} onChange={(event) => filter.onChange(event.target.value)}>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </label>
      ))}
    </div>
  )
}
