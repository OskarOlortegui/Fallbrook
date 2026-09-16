import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { useMRF } from '../hooks/useMRF'
import MRFCard from '../components/MRFCard';

export default function MRF() {
  const { mrfs, loading, error } = useMRF()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search.trim()) return mrfs

    const q = search.toLowerCase()

    return mrfs.filter(mrf =>
      mrf.name?.toLowerCase().includes(q) ||
      mrf.address?.toLowerCase().includes(q) ||
      mrf.city?.toLowerCase().includes(q) ||
      mrf.zipCode?.toLowerCase().includes(q) ||
      mrf.phones?.some(p => p.toLowerCase().includes(q)) ||
      mrf.faxes?.some(f => f.toLowerCase().includes(q))
    )
  }, [mrfs, search])

  return (
    <section className="max-w-4xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium">
          Medical Records Facilities (MRF)
        </h1>

        <p className="text-sm text-(--text2) mt-1">
          {!loading &&
            `${filtered.length} ${
              filtered.length === 1
                ? 'facility'
                : 'facilities'
            } found`
          }
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted) text-sm">🔍</span>

          <input
            type="text"
            placeholder="Search by name, address, city, zip, phone or fax..."
            value={search}
            onChange={e => setSearch(e.target.value)}
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
      {loading && (
        <p className="text-sm text-(--muted)">
          Loading...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-(--danger)">
          {error}
        </p>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12">

          <p className="text-2xl mb-2">🏥</p>
          <p className="text-sm text-(--text2)">No facilities match your search.</p>

          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-xs text-(--accent) mt-2 hover:underline cursor-pointer"
            >
              Clear search
            </button>
          )}

        </div>
      )}


      {/* Results */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">

          {filtered.map(mrf => (
            <MRFCard
              key={mrf._id}
              facility={mrf}
            />
          ))}

        </div>
      )}

    </section>
  )
}