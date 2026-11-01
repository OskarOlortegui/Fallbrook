import { Link, useParams } from 'react-router'
import { useInsuranceDetail } from '../hooks/useInsuranceDetail'

const TYPE_LABELS = {
  commercial: 'Commercial',
  government: 'Government',
  'managed-care': 'Managed Care',
  'workers-comp': "Workers' Compensation",
  selfpay: 'Self Pay',
}

export default function InsuranceDetail() {
  const { slug } = useParams()
  const { insuranceData, loading, error } = useInsuranceDetail(slug)

  if (loading) {
    return <p className="p-8 text-sm text-(--muted)">Loading...</p>
  }

  if (error) {
    return <p className="p-8 text-sm text-(--danger)">{error}</p>
  }

  if (!insuranceData?.insurance) {
    return <p className="p-8 text-sm text-(--muted)">Insurance not found.</p>
  }

  const {
    insurance,
    doctors = [],
    clinics = [],
    medicalGroups = [],
    radiologyCenters = [],
  } = insuranceData

  const {
    name,
    shortName,
    type,
    active,
    phones = [],
    faxes = [],
    notes = [],
  } = insurance

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">

      {/* Breadcrumb */}
      <p className="text-xs text-(--muted) mb-5">
        <Link to="/" className="hover:text-(--accent)">
          Dashboard
        </Link>
        {' / '}
        <Link to="/insurances" className="hover:text-(--accent)">
          Insurances
        </Link>
        {' / '}
        {name}
      </p>

      {/* Header */}
      <div className="flex items-start gap-4 mb-6">

        <div className="w-14 h-14 rounded-full flex items-center justify-center font-medium text-lg flex-shrink-0 bg-(--accent-bg) text-(--accent)">
          {shortName?.slice(0, 2).toUpperCase() ?? 'IN'}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-medium text-(--text)">
              {name}
            </h1>

            <span className={`text-xs px-2.5 py-1 rounded-full ${
              active
                ? 'bg-(--success-bg) text-(--success)'
                : 'bg-(--danger-bg) text-(--danger)'
            }`}>
              {active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {shortName && shortName !== name && (
            <p className="text-sm text-(--text2) mt-1">
              {shortName}
            </p>
          )}

          <p className="text-sm text-(--muted) mt-1">
            {TYPE_LABELS[type] ?? type ?? 'Type not specified'}
          </p>
        </div>
      </div>

      {/* Contact */}
      <section className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">
        <h2 className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">
          Contact
        </h2>

        <div className="space-y-2 text-sm text-(--text2)">

          {phones.length > 0 ? (
            phones.map((phone, index) => (
              <p key={`${phone}-${index}`}>
                📞 {phone}
              </p>
            ))
          ) : (
            <p className="text-(--muted) italic">No phone information.</p>
          )}

          {faxes.length > 0 ? (
            faxes.map((fax, index) => (
              <p key={`${fax}-${index}`}>
                📠 {fax}
              </p>
            ))
          ) : (
            <p className="text-(--muted) italic">No fax information.</p>
          )}

        </div>
      </section>

      {/* Doctors */}
      <section className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">
        <h2 className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">
          Doctors ({doctors.length})
        </h2>

        {doctors.length === 0 ? (
          <p className="text-sm text-(--muted) italic">
            No doctors associated with this insurance.
          </p>
        ) : (
          <div className="space-y-3">
            {doctors.map(doctor => (
              <div key={doctor._id}>
                <Link
                  to={`/doctors/${doctor._id}`}
                  className="text-sm font-medium text-(--accent) hover:underline"
                >
                  {doctor.name}
                </Link>

                <p className="text-xs text-(--text2) mt-0.5">
                  {doctor.specialty || 'Specialty not specified'}
                  {doctor.npi && ` · NPI: ${doctor.npi}`}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Clinics */}
      <section className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">
        <h2 className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">
          Clinics ({clinics.length})
        </h2>

        {clinics.length === 0 ? (
          <p className="text-sm text-(--muted) italic">
            No clinics associated with this insurance.
          </p>
        ) : (
          <div className="space-y-3">
            {clinics.map(clinic => (
              <div key={clinic._id}>
                <Link
                  to={`/clinics/${clinic._id}`}
                  className="text-sm font-medium text-(--accent) hover:underline"
                >
                  {clinic.name}
                </Link>

                <p className="text-xs text-(--text2) mt-0.5">
                  {[clinic.city, clinic.state].filter(Boolean).join(', ')}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Medical Groups */}
      <section className="bg-(--surface) border border-(--border) rounded-xl p-5 mb-4">
        <h2 className="text-xs font-medium text-(--muted) uppercase tracking-wide mb-3">
          Medical Groups ({medicalGroups.length})
        </h2>

        {medicalGroups.length === 0 ? (
          <p className="text-sm text-(--muted) italic">
            No medical groups associated with this insurance.
          </p>
        ) : (
          <div className="space-y-3">
            {medicalGroups.map(group => (
              <div key={group._id}>
                <Link
                  to={`/medical-groups/${group._id}`}
                  className="text-sm font-medium text-(--accent) hover:underline"
                >
                  {group.name}
                </Link>
              </div>
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
            No radiology centers associated with this insurance.
          </p>
        ) : (
          <div className="space-y-3">
            {radiologyCenters.map(center => (
              <div key={center._id}>
                <p className="text-sm font-medium text-(--text)">
                  {center.name}
                </p>
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
                className={`mb-3 pb-3 border-b border-(--border) last:border-0 last:mb-0 last:pb-0 ${
                  note.pinned ? 'border-l-2 border-l-(--accent) pl-3' : ''
                }`}
              >
                <p className="text-sm text-(--text)">
                  {note.content}
                </p>

                <p className="text-[11px] text-(--muted) mt-1">
                  {note.author}
                  {' · '}
                  {note.date
                    ? new Date(note.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : ''}
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
