import { Link } from 'react-router';
const STATUS_COLOR = {
  verified: 'bg-(--success)',
  pending: 'bg-yellow-400',
  'out-of-network': 'bg-orange-400',
  deleted: 'bg-(--danger)',
}

export default function InsuranceCard({ insurance }) {
  const {
    name,
    shortName,
    type,
    active,
    phones = [],
    faxes = [],
  } = insurance

  const TYPE_LABELS = {
    commercial: 'Commercial',
    government: 'Government',
    'managed-care': 'Managed Care',
    'workers-comp': "Workers' Comp",
    selfpay: 'Self Pay',
  }

  return (
    <article className="bg-(--surface) border border-(--border) rounded-xl p-4 hover:border-(--accent) transition-colors">

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">

        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-medium text-(--text)">
            {name}
          </h2>

          {shortName && shortName !== name && (
            <p className="text-xs text-(--text2) mt-0.5">
              {shortName}
            </p>
          )}
        </div>

        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${active ? 'bg-(--success)' : 'bg-(--danger)'
            }`}
          title={active ? 'Active' : 'Inactive'}
        />
      </div>

      <hr className="border-(--border) mb-3" />

      {/* Insurance information */}
      <div className="space-y-2 text-xs text-(--text2)">

        {/* Type */}
        <p>
          <span className="text-(--muted)">Type:</span>{' '}
          <span className="capitalize">
            {TYPE_LABELS[type] ?? type ?? 'Not specified'}
          </span>
        </p>

        {/* Phone */}
        {phones.length > 0 && (
          <p>📞 {phones[0]}</p>
        )}

        {/* Fax */}
        {faxes.length > 0 && (
          <p>📠 {faxes[0]}</p>
        )}

        {phones.length === 0 && faxes.length === 0 && (
          <p className="text-(--muted) italic">
            No contact information
          </p>
        )}

      </div>
      
      {/* Actions */}
      <div className="flex gap-2 mt-4">

        <button
          type="button"
          className="flex-1 text-xs border border-(--border) rounded-lg py-1.5 text-(--text2) hover:bg-(--surface2) cursor-pointer"
        >
          📝 Note
        </button>

        <Link
          to={`/insurances/${insurance.slug}`}
          className="flex-1 text-center text-xs bg-(--accent) text-white rounded-lg py-2 hover:opacity-90 transition-opacity"
        >
          View detail
        </Link>

      </div>

    </article>
  )
}
