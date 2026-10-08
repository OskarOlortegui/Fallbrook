import { useParams, Link } from 'react-router'
import { useDoctorDetail } from '../hooks/useDoctorDetail'

function initials(name) {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const STATUS_COLOR = {
  verified:         'bg-(--success-bg) text-(--success)',
  pending:          'bg-yellow-50 text-yellow-700',
  'out-of-network': 'bg-orange-50 text-orange-700',
  deleted:          'bg-(--danger-bg) text-(--danger)',
}

export default function DoctorDetail() {
  const { id } = useParams()
  const { doctor, loading, error } = useDoctorDetail(id)

  if (loading) return <p className="p-8 text-sm text-(--muted)">Loading...</p>
  if (error)   return <p className="p-8 text-sm text-(--danger)">{error}</p>
  if (!doctor) return null

  const {
    name, gender, specialty, npi, status,
    clinics = [], medicalGroups = [],
    insurances = [], notes = []
  } = doctor

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">

      {/* Breadcrumb */}
      <p className="text-xs text-(--muted) mb-5">
        <Link to="/"        className="hover:text-(--accent)">Dashboard</Link>
        {' / '}
        <Link to="/doctors" className="hover:text-(--accent)">Doctors</Link>
        {' / '}{name}
      </p>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center font-medium text-base flex-shrink-0 ${
          gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-(--accent-bg) text-(--accent)'
        }`}>
          {initials(name)}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-medium text-(--text)">{name}</h1>
            <span className={`text-xs px-2.5 py-1 rounded-full ${STATUS_COLOR[status] ?? 'bg-(--surface2) text-(--text2)'}`}>
              {status}
            </span>
          </div>
          <p className="text-sm text-(--text2) mt-0.5 capitalize">{specialty}</p>
          <p className="text-xs text-(--muted) mt-0.5 font-mono">NPI: {npi}</p>
        </div>
      </div>

      {/* Clinics */}
      <div className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">
        <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">
          Clinics ({clinics.length})
        </p>
        {clinics.length === 0
          ? <p className="text-sm text-(--muted) italic">No clinics assigned</p>
          : clinics.map(c => (
              <div key={c._id} className="mb-3 pb-3 border-b border-(--border) last:border-0 last:mb-0 last:pb-0">
                <p className="text-sm font-medium text-(--text)">{c.name}</p>
                <p className="text-xs text-(--text2) mt-0.5">{c.address}, {c.city}, {c.state} {c.zipCode}</p>
                <div className="flex gap-3 mt-1.5 text-xs text-(--text2)">
                  {c.phones?.[0] && <span>📞 {c.phones[0]}</span>}
                  {c.faxes?.[0]  && <span>📠 {c.faxes[0]}</span>}
                </div>
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
      <div className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">
        <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">
          Insurances ({insurances.length})
        </p>
        {insurances.length === 0
          ? <p className="text-sm text-(--muted) italic">No insurances assigned</p>
          : (
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
          )
        }
      </div>

      {/* Notes */}
      <div className="bg-(--surface) border border-(--border) rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">
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

    </div>
  )
}