import { useParams, Link } from 'react-router'
import { useRadiologyCenterDetail } from '../hooks/useRadiologyCenterDetail'

const STATUS_COLOR = {
  active:     'bg-(--success-bg) text-(--success)',
  prohibited: 'bg-(--danger-bg) text-(--danger)',
  deleted:    'bg-(--danger-bg) text-(--danger)',
}

export default function RadiologyCenterDetail() {
  const { id }                      = useParams()
  const { center, loading, error }  = useRadiologyCenterDetail(id)

  if (loading) return <p className="p-8 text-sm text-(--muted)">Loading...</p>
  if (error)   return <p className="p-8 text-sm text-(--danger)">{error}</p>
  if (!center) return null

  const {
    name, npi, tin, status, accountNo, website,
    locations = [], medicalGroups = [],
    insurances = [], notes = [], createdAt
  } = center

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">

      {/* Breadcrumb */}
      <p className="text-xs text-(--muted) mb-5">
        <Link to="/"                  className="hover:text-(--accent)">Dashboard</Link>
        {' / '}
        <Link to="/radiology-centers" className="hover:text-(--accent)">Radiology Centers</Link>
        {' / '}{name}
      </p>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl font-medium text-(--text)">{name}</h1>
          {npi && <p className="text-xs text-(--muted) mt-0.5 font-mono">NPI: {npi}</p>}
          {tin && <p className="text-xs text-(--muted) font-mono">TIN: {tin}</p>}
          {accountNo && <p className="text-xs text-(--muted) mt-0.5">Account #: {accountNo}</p>}
        </div>
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_COLOR[status] ?? 'bg-(--surface2) text-(--text2)'}`}>
            {status}
          </span>
          {website && (
            <a href={website} target="_blank" rel="noreferrer" className="text-xs text-(--accent) hover:underline">
              🌐 Website
            </a>
          )}
        </div>
      </div>

      {/* Locations */}
      <div className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">
        <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">
          Locations ({locations.length})
        </p>
        {locations.length === 0
          ? <p className="text-sm text-(--muted) italic">No locations available</p>
          : locations.map((loc, i) => (
              <div key={loc._id ?? i} className="mb-4 pb-4 border-b border-(--border) last:border-0 last:mb-0 last:pb-0">

                {/* Location name */}
                {loc.LocationName && (
                  <p className="text-sm font-medium text-(--text) mb-1">{loc.LocationName}</p>
                )}

                {/* Address */}
                <p className="text-xs text-(--text2)">
                  {loc.address}{loc.city ? `, ${loc.city}` : ''}{loc.state ? `, ${loc.state}` : ''} {loc.zipCode}
                </p>

                {/* Phones */}
                <div className="mt-2 space-y-1">
                  {loc.phones?.length > 0
                    ? loc.phones.map((p, pi) => (
                        <p key={pi} className="flex gap-2 text-xs text-(--text2)">
                          <span className="text-(--muted) flex-shrink-0">📞</span>{p}
                        </p>
                      ))
                    : <p className="text-xs text-(--muted) italic">No phone</p>
                  }
                </div>

                {/* Faxes */}
                <div className="mt-1 space-y-1">
                  {loc.faxes?.length > 0
                    ? loc.faxes.map((f, fi) => (
                        <p key={fi} className="flex gap-2 text-xs text-(--text2)">
                          <span className="text-(--muted) flex-shrink-0">📠</span>{f}
                        </p>
                      ))
                    : <p className="text-xs text-(--muted) italic">No fax</p>
                  }
                </div>

                {/* Location website */}
                {loc.website && (
                  <a href={loc.website} target="_blank" rel="noreferrer" className="text-xs text-(--accent) hover:underline mt-1.5 inline-block">
                    🌐 {loc.website}
                  </a>
                )}
              </div>
            ))
        }
      </div>

      {/* Medical Groups */}
      {medicalGroups.length > 0 && (
        <div className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">
          <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">
            Medical Groups ({medicalGroups.length})
          </p>
          {medicalGroups.map(mg => (
            <div key={mg._id} className="mb-3 pb-3 border-b border-(--border) last:border-0 last:mb-0 last:pb-0">
              <p className="text-sm font-medium text-(--text)">{mg.name}</p>
              <div className="flex gap-3 mt-1 text-xs text-(--text2)">
                {mg.phones?.[0] && <span>📞 {mg.phones[0]}</span>}
                {mg.faxes?.[0]  && <span>📠 {mg.faxes[0]}</span>}
                {mg.website     && (
                  <a href={mg.website} target="_blank" rel="noreferrer" className="text-(--accent) hover:underline">
                    🌐 Website
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Insurances */}
      {insurances.length > 0 && (
        <div className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">
          <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">
            Insurances ({insurances.length})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {insurances.map(ins => (
              <span
                key={ins.slug ?? ins.name}
                className="text-[11px] px-2 py-0.5 rounded-full bg-(--accent-bg) text-(--accent) border border-(--border)"
              >
                {ins.shortName ?? ins.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="bg-(--surface) border border-(--border) rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-(--muted) uppercase tracking-wide">
            Notes ({notes.length})
          </p>
          <button className="text-xs border border-(--border) rounded-lg px-3 py-1.5 text-(--text2) hover:bg-(--surface2) cursor-pointer">
            📝 Add note
          </button>
        </div>
        {notes.length === 0
          ? <p className="text-sm text-(--muted) italic">No notes yet.</p>
          : [...notes]
              .sort((a, b) => b.pinned - a.pinned)
              .map(note => (
                <div
                  key={note._id}
                  className={`mb-3 pb-3 border-b border-(--border) last:border-0 last:mb-0 last:pb-0 ${
                    note.pinned ? 'border-l-2 border-l-(--accent) pl-3' : ''
                  }`}
                >
                  <p className="text-sm text-(--text)">{note.content}</p>
                  <p className="text-[11px] text-(--muted) mt-1">
                    {note.author} · {new Date(note.date).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                    {note.pinned && <span className="ml-2 text-(--accent)">📌 pinned</span>}
                  </p>
                </div>
              ))
        }
      </div>

      {/* Meta */}
      <p className="text-xs text-(--muted) text-center mt-6">
        Added {new Date(createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
      </p>

    </div>
  )
}