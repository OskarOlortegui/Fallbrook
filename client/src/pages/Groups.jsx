import { useCallback } from 'react'
import { api } from '../services/api'
import { useEntitySearch } from '../hooks/useEntitySearch'
import MedicalGroupCard from '../components/MedicalGroupCard'

const MEDICAL_GROUP_SEARCH_FIELDS = [
'name',
'phones',
'faxes',
'website',
'status',
]

export default function Groups() {
const fetchMedicalGroups = useCallback(
() => api.getMedicalGroups(),
[]
)

const {
data: medicalGroups,
search,
setSearch,
loading,
error,
} = useEntitySearch(
fetchMedicalGroups,
MEDICAL_GROUP_SEARCH_FIELDS
)

return (
<section className="max-w-4xl mx-auto px-6 py-8">

  {/* Header */}
  <div className="mb-6">
    <h1 className="text-xl font-medium">
      Medical Groups
    </h1>

    <p className="text-sm text-(--text2) mt-1">
      {!loading && !error &&
        `${medicalGroups.length} Medical Groups found`}
    </p>
  </div>

  {/* Search */}
  <div className="relative mb-6">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-(--muted)">
      🔍
    </span>

    <input
      type="text"
      placeholder="Search by name, phone, fax or website..."
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
      Loading medical groups...
    </p>
  )}

  {/* Error */}
  {error && !loading && (
    <div className="p-4 mb-4 border border-red-500/20 bg-red-500/10 rounded-xl text-red-500 text-sm">
      <strong>Error:</strong> {error}
    </div>
  )}

  {/* Empty results */}
  {!loading && !error && medicalGroups.length === 0 && (
    <p className="text-sm text-(--muted)">
      {search
        ? 'No medical groups match your search.'
        : 'No medical groups found.'}
    </p>
  )}

  {/* Results */}
  {!loading && !error && medicalGroups.length > 0 && (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {medicalGroups.map(group => (
        <MedicalGroupCard
          key={group._id}
          group={group}
        />
      ))}
    </div>
  )}

</section>

)
}