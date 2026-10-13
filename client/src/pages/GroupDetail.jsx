
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { api } from '../services/api'
import { useMedicalGroupDetail } from '../hooks/useMedicalGroupDetail'

const STATUS_COLOR = {
  verified: 'bg-(--success-bg) text-(--success)',
  pending: 'bg-yellow-50 text-yellow-700',
  'out-of-network': 'bg-orange-50 text-orange-700',
  deleted: 'bg-(--danger-bg) text-(--danger)',
}

export default function GroupDetail() {
  const { id } = useParams()
  const { group, loading, error } = useMedicalGroupDetail(id)

  const [newNote, setNewNote] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const [noteError, setNoteError] = useState(null)

  if (loading) {
    return <p className="p-8 text-sm text-(--muted)">Loading...</p>
  }

  if (error) {
    return <p className="p-8 text-sm text-(--danger)">{error}</p>
  }

  if (!group) {
    return <p className="p-8 text-sm text-(--muted)">Medical group not found.</p>
  }

  const {
    name,
    phones = [],
    faxes = [],
    website,
    status,
    notes = [],
    insurances = [],
    radiologyCenters = [],
  } = group

  async function handleAddNote(e) {
    e.preventDefault()

    const content = newNote.trim()
    if (!content || savingNote) return

    try {
      setSavingNote(true)
      setNoteError(null)

      await api.addMedicalGroupNote(id, { content })

      // Reload the group to display the new note.
      const response = await api.getMedicalGroupById(id)
      setNewNote('')

      // The hook owns the group state, so reload through a page refresh
      // or move the refresh function into the hook.
      window.location.reload()
    } catch (err) {
      setNoteError(err.message || 'Could not add note.')
    } finally {
      setSavingNote(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">

      {/* Breadcrumb */}
      <p className="text-xs text-(--muted) mb-5">
        <Link to="/" className="hover:text-(--accent)">
          Dashboard
        </Link>
        {' / '}
        <Link to="/medical-groups" className="hover:text-(--accent)">
          Medical Groups
        </Link>
        {' / '}
        {name}
      </p>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-full flex items-center justify-center font-medium bg-(--accent-bg) text-(--accent)">
          MG
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-medium text-(--text)">
              {name}
            </h1>

            <span className={`text-xs px-2.5 py-1 rounded-full ${
              STATUS_COLOR[status] ?? 'bg-(--surface2) text-(--text2)'
            }`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      {/* Contact */}
      <section className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">
        <h2 className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">
          Contact
        </h2>

        <div className="space-y-2 text-sm text-(--text2)">
          {phones.map((phone, i) => (
            <p key={`${phone}-${i}`}>📞 {phone}</p>
          ))}

          {faxes.map((fax, i) => (
            <p key={`${fax}-${i}`}>📠 {fax}</p>
          ))}

          {website && (
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="block text-(--accent) hover:underline break-all"
            >
              🌐 {website}
            </a>
          )}

          {!phones.length && !faxes.length && !website && (
            <p className="text-sm text-(--muted) italic">
              No contact information available.
            </p>
          )}
        </div>
      </section>

      {/* Insurances */}
      <section className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">
        <h2 className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">
          Insurances ({insurances.length})
        </h2>

        {insurances.length === 0 ? (
          <p className="text-sm text-(--muted) italic">
            No insurance information available.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {insurances.map((ins, i) => (
              <span
                key={ins.slug ?? ins._id ?? ins.name ?? i}
                className="text-[11px] px-2 py-1 rounded-full bg-(--accent-bg) text-(--accent) border border-(--border)"
              >
                {ins.shortName ?? ins.name}
              </span>
            ))}
          </div>
        )}
      </section>

      {/* Radiology Centers */}
      <section className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">
        <h2 className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">
          Radiology Centers ({radiologyCenters.length})
        </h2>

        {radiologyCenters.length === 0 ? (
          <p className="text-sm text-(--muted) italic">
            No radiology centers assigned.
          </p>
        ) : (
          <div className="space-y-4">
            {radiologyCenters.map((center, i) => (
              <div key={center._id ?? `${center.name}-${i}`}>
                <p className="text-sm font-medium text-(--text)">
                  {center.name}
                </p>

                {center.locations?.map((location, j) => (
                  <p
                    key={location._id ?? j}
                    className="text-xs text-(--text2) mt-1"
                  >
                    {typeof location === 'string'
                      ? location
                      : [
                          location.address,
                          location.city,
                          location.state,
                          location.zipCode,
                        ].filter(Boolean).join(', ')}
                  </p>
                ))}

                {center.website && (
                  <a
                    href={center.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-(--accent) hover:underline"
                  >
                    Website
                  </a>
                )}

                {center.since && (
                  <p className="text-xs text-(--muted) mt-1">
                    Since {new Date(center.since).toLocaleDateString('en-US')}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Notes */}
      <section className="bg-(--surface) border border-(--border) rounded-xl p-5">
        <h2 className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">
          Notes ({notes.length})
        </h2>

        <form onSubmit={handleAddNote} className="mb-5">
          <textarea
            value={newNote}
            onChange={e => setNewNote(e.target.value)}
            placeholder="Write a note..."
            rows={3}
            className="w-full bg-(--surface) border border-(--border) rounded-lg p-3 text-sm text-(--text) focus:outline-none focus:border-(--accent)"
          />

          {noteError && (
            <p className="text-sm text-(--danger) mt-2">
              {noteError}
            </p>
          )}

          <button
            type="submit"
            disabled={!newNote.trim() || savingNote}
            className="mt-2 text-xs bg-(--accent) text-white rounded-lg px-4 py-2 hover:opacity-90 disabled:opacity-50"
          >
            {savingNote ? 'Saving...' : '＋ Add note'}
          </button>
        </form>

        {notes.length === 0 ? (
          <p className="text-sm text-(--muted) italic">
            No notes yet.
          </p>
        ) : (
          [...notes]
            .sort((a, b) => Number(b.pinned) - Number(a.pinned))
            .map(note => (
              <div
                key={note._id}
                className={`mb-3 pb-3 border-b border-(--border) last:border-0 ${
                  note.pinned ? 'border-l-2 border-l-(--accent) pl-3' : ''
                }`}
              >
                <p className="text-sm text-(--text)">
                  {note.content}
                </p>

                <p className="text-[11px] text-(--muted) mt-1">
                  {note.author} · {note.date && new Date(note.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}

                  {note.pinned && (
                    <span className="ml-2 text-(--accent)">
                      📌 pinned
                    </span>
                  )}
                </p>
              </div>
            ))
        )}
      </section>
    </div>
  )
}
