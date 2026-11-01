
import { useCallback } from 'react'
import { api } from '../services/api'
import { useEntitySearch } from '../hooks/useEntitySearch'
import InsuranceCard from '../components/InsuranceCard'

const INSURANCE_SEARCH_FIELDS = [
  'name',
  'shortName',
  'slug',
  'type',
  'phones',
  'faxes',
  'active'
]

export default function Insurances() {
  const fetchInsurances = useCallback(
    () => api.getInsurances(),
    []
  )

  const {
    data: insurances,
    search,
    setSearch,
    loading,
    error
  } = useEntitySearch(
    fetchInsurances,
    INSURANCE_SEARCH_FIELDS
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium">
          All Insurances
        </h1>

        <p className="text-sm text-(--text2) mt-1">
          {!loading && !error &&
            `${insurances.length} Insurances found`}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-(--muted)">
          🔍
        </span>

        <input
          type="text"
          placeholder="Search by name, short name, type, phone or fax..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-(--surface) border border-(--border) rounded-xl pl-9 pr-20 py-2.5 text-sm text-(--text) placeholder:text-(--muted) focus:outline-none focus:border-(--accent)"
        />

        {search && (
          <button
            type="button"
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted) hover:text-(--text2) text-xs"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-(--muted)">
          Loading insurances...
        </p>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="p-4 mb-4 border border-red-500/20 bg-red-500/10 rounded-xl text-red-500 text-sm flex items-center gap-2">
          <span>⚠️</span>
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {/* Empty results */}
      {!loading && !error && insurances.length === 0 && (
        <div className="text-center py-12">
          <p className="text-2xl mb-2">🛡️</p>
          <p className="text-sm text-(--text2)">
            {search.trim()
              ? 'No insurances match your search.'
              : 'No insurances found.'}
          </p>

          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="text-xs text-(--accent) mt-2 hover:underline cursor-pointer"
            >
              Clear search
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {!loading && !error && insurances.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {insurances.map(insurance => (
            <InsuranceCard
              key={insurance._id}
              insurance={insurance}
            />
          ))}
        </div>
      )}

    </div>
  )
}
