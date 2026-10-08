import { useParams, Link } from 'react-router'
import { useClinicDetail } from '../hooks/useClinicDetail'

const STATUS_COLOR = {
  verified:         'bg-(--success-bg) text-(--success)',
  pending:          'bg-yellow-50 text-yellow-700',
  'out-of-network': 'bg-orange-50 text-orange-700',
  deleted:          'bg-(--danger-bg) text-(--danger)',
}

export default function ClinicDetail() {

  const { id } = useParams()
  const { clinic, loading, error } = useClinicDetail(id)

  if (loading) return <p className="p-8 text-sm text-(--muted)">Loading...</p>
  if (error)   return <p className="p-8 text-sm text-(--danger)">{error}</p>
  if (!clinic) return null

  const {
    name, address, city, state, zipCode,
    phones = [],
    faxes = [],
    status, isMRF, requestCount = 0,
    insurances = [],
    notes = []
  } = clinic

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">

      {/* Breadcrumb */}
      <p className="text-xs text-(--muted) mb-5">
        <Link to="/"        className="hover:text-(--accent)">Dashboard</Link>
        {' / '}
        <Link to="/clinics" className="hover:text-(--accent)">Clinics</Link>
        {' / '}{name}
      </p>


      {/* Header */}
      <div className="flex items-start gap-4 mb-6">

        <div className="w-14 h-14 rounded-full flex items-center justify-center text-xl flex-shrink-0 bg-(--accent-bg) text-(--accent)">🏥</div>
        <div className="flex-1">

          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-medium text-(--text)">{name}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_COLOR[status] ?? 'bg-(--surface2) text-(--text2)'}`}>
              {status}
            </span>

            {isMRF && (<span className="text-xs px-2.5 py-1 rounded-full bg-(--accent-bg) text-(--accent)">MRF</span>)}
          </div>

          <p className="text-sm text-(--text2) mt-1">{address}</p>
          <p className="text-sm text-(--text2)">{city}, {state} {zipCode}</p>
        </div>
      </div>


      {/* Contact */}
      <div className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">

        <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">Contact</p>
        <div className="space-y-2">

          {phones.length > 0 && (
            <div className="text-sm text-(--text2)">
              <span className="mr-2">📞</span>

              {phones.map((phone, index) => (
                <span key={index}>
                  {phone}
                  {index < phones.length - 1 && ', '}
                </span>
              ))}
            </div>
          )}

          {faxes.length > 0 && (
            <div className="text-sm text-(--text2)">
              <span className="mr-2">📠</span>

              {faxes.map((fax, index) => (
                <span key={index}>
                  {fax}
                  {index < faxes.length - 1 && ', '}
                </span>
              ))}
            </div>
          )}

          {!phones.length && !faxes.length && (
            <p className="text-sm text-(--muted) italic">
              No contact information available
            </p>
          )}
        </div>
      </div>

      {/* MRF Information */}
      {isMRF && (
        <div className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">
          <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">MRF Information</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-(--text2)">Request count</span>
            <span className="text-sm font-medium text-(--text)">{requestCount}</span>
          </div>
        </div>
      )}

      {/* Insurances */}
      <div className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">
        <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">Insurances ({insurances.length})</p>

        {insurances.length === 0 ? <p className="text-sm text-(--muted) italic">No insurances assigned</p>
         : (
          <div className="flex flex-wrap gap-1.5">

            {insurances.map((insurance, index) => (

              <div key={insurance._id ?? insurance.slug ?? insurance.name ?? index}
                className="text-[11px] px-2 py-0.5 rounded-full bg-(--accent-bg) text-(--accent) border border-(--border)"
              >
                {insurance.shortName ?? insurance.name}

                {insurance.effectiveDate && (
                  <span className="text-xs text-(--muted)">
                    Since {new Date(
                      insurance.effectiveDate
                    ).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="bg-(--surface) border border-(--border) rounded-xl p-5">

        <div className="flex items-center justify-between mb-3">

          <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">Notes ({notes.length})</p>
          <button className="text-xs border border-(--border) rounded-lg px-3 py-1.5 text-(--text2) hover:bg-(--surface2) cursor-pointer">
            📝 Add note
          </button>

        </div>

        {notes.length === 0 ? <p className="text-sm text-(--muted) italic">No notes yet.</p>
        : (

          [...notes]
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
                  {note.author} · {new Date(note.date).toLocaleDateString('en-US',{
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  {note.pinned && <span className="ml-2 text-(--accent)">📌 pinned</span>}
                </p>
              </div>
            ))
        )}
      </div>
    </div>
  )
}