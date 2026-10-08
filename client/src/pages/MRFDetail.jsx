import { useParams, Link } from 'react-router'
import { useClinicDetail } from '../hooks/useClinicDetail'
import { useState, useEffect } from 'react'

export default function MRFDetail() {
  const { id } = useParams()
  const { clinic, loading, error } = useClinicDetail(id)

  const [form, setForm] = useState({
    patientName: '',
    dob: '',
    facility: '',
    fax: '',
  })

  useEffect(() => {
    if (clinic) {
      setForm(prev => ({
        ...prev,
        facility: clinic.name,
      }))
    }
  }, [clinic])

  function handleChange(e) {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()

    // Por ahora NO hacemos nada.
    // En el futuro aquí irá el request para generar/enviar el MRF.
    console.log('MRF form:', form)
  }

  if (loading) {
    return (
      <p className="p-8 text-sm text-(--muted)">
        Loading...
      </p>
    )
  }

  if (error) {
    return (
      <p className="p-8 text-sm text-(--danger)">
        {error}
      </p>
    )
  }

  if (!clinic) {
    return null
  }

  const {
    name,
    address,
    city,
    state,
    zipCode,
    phones = [],
    faxes = [],
    notes = [],
    status,
    insurances = [],
    requestCount = 0,
    createdAt
  } = clinic

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">

      {/* Breadcrumb LO ESTA HARDCODEANDO hay una libreria? para hacerlo un componente reutilizable?*/}
      <p className="text-xs text-(--muted) mb-5">
        <Link to="/" className="hover:text-(--accent)">
          Dashboard
        </Link>
        {' / '}
        <Link to="/clinics/mrf" className="hover:text-(--accent)">
          MRF
        </Link>
        {' / '}
        {name}
      </p>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">

        <div>
          <h1 className="text-xl font-medium text-(--text)">{name}</h1>
          <p className="text-sm text-(--text2) mt-1">{address}, {city}, {state} {zipCode}</p>
        </div>

        <span
          className={`text-xs px-2.5 py-1 rounded-full flex-shrink-0 ${
            status === 'verified'
              ? 'bg-(--success-bg) text-(--success)'
              : 'bg-(--danger-bg) text-(--danger)'
          }`}
        >
          {status}
        </span>

      </div>

      {/* Contact */}
      <div className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">

        <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">Contact</p>

        <div className="space-y-2">

          {phones.length > 0 ? (
            phones.map((phone, index) => (
              <p
                key={index}
                className="flex gap-2 text-sm text-(--text2)"
              >
                <span className="text-(--muted)">
                  📞
                </span>

                {phone}
              </p>
            ))
          ) : (
            <p className="text-sm text-(--muted) italic">No phone</p>
          )}

          {faxes.length > 0 ? (
            faxes.map((fax, index) => (
              <p
                key={index}
                className="flex gap-2 text-sm text-(--text2)"
              >
                <span className="text-(--muted)">
                  📠
                </span>

                {fax}
              </p>
            ))
          ) : (
            <p className="text-sm text-(--muted) italic">No fax</p>
          )}

        </div>
      </div>

      {/* Insurances */}
      <div className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">

        <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">Accepted insurances</p>

        {insurances.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {insurances.map(insurance => (
              <span
                key={insurance.slug}
                className="text-[11px] px-2 py-0.5 rounded-full bg-(--accent-bg) text-(--accent) border border-(--border)"
              >
                {insurance.shortName || insurance.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-(--muted) italic">No verified insurances associated with this clinic.</p>
        )}

      </div>


      {/* Stats */}
      <div className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">

        <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">Stats</p>

        <div className="flex gap-8">
          <div>
            <p className="text-2xl font-medium text-(--text)">{requestCount}</p>
            <p className="text-xs text-(--muted) mt-0.5">Requests sent</p>
          </div>

          <div>
            <p className="text-2xl font-medium text-(--text)">
              {createdAt
                ? new Date(createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric'
                  })
                : '—'
              }
            </p>

            <p className="text-xs text-(--muted) mt-0.5">Added</p>
          </div>

        </div>

      </div>

      {/* Notes */}
      {notes.length > 0 && (

        <div className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">

          <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">Notes</p>

          {[...notes]
            .sort((a, b) => Number(b.pinned) - Number(a.pinned))
            .map(note => (

              <div
                key={note._id}
                className={`mb-3 pb-3 border-b border-(--border) last:border-0 last:mb-0 last:pb-0 ${
                  note.pinned
                    ? 'border-l-2 border-l-(--accent) pl-3'
                    : ''
                }`}
              >

                <p className="text-sm text-(--text)">{note.content}</p>

                <p className="text-[11px] text-(--muted) mt-1">
                  {note.author}
                  {' · '}
                  {note.date
                    ? new Date(note.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : ''
                  }
                  {note.pinned && (
                    <span className="ml-2 text-(--accent)">
                      📌 pinned
                    </span>
                  )}
                </p>
              </div>
            ))
          }

        </div>

      )}


      {/* MRF Request Form */}
      <div className="bg-(--surface) border border-(--border) rounded-xl p-5">

        <p className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-4">Send MRF Request</p>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Patient Name */}
          <div>
            <label className="block text-xs text-(--text2) mb-1.5">Patient name <span className="text-(--danger)">*</span></label>

            <input
              name="patientName"
              type="text"
              required
              placeholder="Full name"
              value={form.patientName}
              onChange={handleChange}
              className="w-full bg-(--surface2) border border-(--border) rounded-lg px-3 py-2 text-sm text-(--text) placeholder:text-(--muted) focus:outline-none focus:border-(--accent)"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs text-(--text2) mb-1.5">Date of birth <span className="text-(--danger)">*</span></label>

            <input
              name="dob"
              type="date"
              required
              value={form.dob}
              onChange={handleChange}
              className="w-full bg-(--surface2) border border-(--border) rounded-lg px-3 py-2 text-sm text-(--text) focus:outline-none focus:border-(--accent)"
            />
          </div>

          {/* Facility */}
          <div>
            <label className="block text-xs text-(--text2) mb-1.5">Facility</label>

            <input
              name="facility"
              type="text"
              value={form.facility}
              onChange={handleChange}
              className="w-full bg-(--surface2) border border-(--border) rounded-lg px-3 py-2 text-sm text-(--text) focus:outline-none focus:border-(--accent)"
            />
          </div>

          {/* Fax */}
          <div>
            <label className="block text-xs text-(--text2) mb-1.5">Fax number</label>

            <input
              name="fax"
              type="text"
              value={form.fax}
              onChange={handleChange}
              placeholder="No fax available"
              className="w-full bg-(--surface2) border border-(--border) rounded-lg px-3 py-2 text-sm text-(--text) placeholder:text-(--muted) focus:outline-none focus:border-(--accent)"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-(--accent) text-white text-sm rounded-lg py-2.5 hover:opacity-90 transition-opacity font-medium cursor-pointer"
          >
            Send MRF Request
          </button>

        </form>

      </div>

    </div>
  )
}