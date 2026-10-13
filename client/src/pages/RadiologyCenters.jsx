import { useCallback } from 'react'
import { api } from '../services/api'
import { useEntitySearch } from '../hooks/useEntitySearch'
import RadiologyCenterCard from '../components/RadiologyCenterCard'

const RADIOLOGY_SEARCH_FIELDS = [
  'name',
  'npi',
  'tin',
  'locations.LocationName',
  'locations.address',
  'locations.city',
  'locations.state',
  'locations.zipCode',
  'locations.phones',
  'locations.faxes',
  'locations.website',
  'notes.content'
]

export default function RadiologyCenters() {
  const fetchRadiologyCenters = useCallback(
    () => api.getRadiology(),
    []
  )

  const {
    data: centers,
    search,
    setSearch,
    loading,
    error,
    totalCount
  } = useEntitySearch(
    fetchRadiologyCenters,
    RADIOLOGY_SEARCH_FIELDS
  )

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium">Radiology Centers</h1>
        <p className="text-sm text-(--text2) mt-1">
          {!loading && !error && `${centers.length} center${centers.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted) text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, city, address, phone..."
          className="w-full bg-(--surface) border border-(--border) rounded-xl pl-9 pr-4 py-2.5 text-sm text-(--text) placeholder:text-(--muted) focus:outline-none focus:border-(--accent)"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted) hover:text-(--text2) text-xs"
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && <p className="text-sm text-(--muted)">Loading...</p>}

      {/* Error */}
      {error && !loading && (
        <div className="p-4 mb-4 border border-(--danger) bg-(--danger-bg) rounded-xl text-(--danger) text-sm flex items-center gap-2">
          <span>⚠️</span>
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && centers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-2xl mb-2">☢️</p>
          <p className="text-sm text-(--text2)">
            {search.trim() ? 'No centers match your search.' : 'No radiology centers found.'}
          </p>
          {search && (
            <button onClick={() => setSearch('')} className="text-xs text-(--accent) mt-2 hover:underline cursor-pointer">
              Clear search
            </button>
          )}
        </div>
      )}

      {!loading && !error && centers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {centers.map(center => (
            <RadiologyCenterCard
              key={center._id}
              center={center}
            />
          ))}
        </div>
      )}
    </div>
  )
}
