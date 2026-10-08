import { Link } from 'react-router'

const STATUS_COLOR = {
  verified:         'bg-(--success)',
  pending:          'bg-yellow-400',
  'out-of-network': 'bg-orange-400',
  deleted:          'bg-(--danger)',
}

export default function ClinicCard({ clinic }) {
  const {name, address, city, state, zipCode, phones = [], faxes = [], status, isMRF} = clinic

  return (
    <div className="bg-(--surface) border border-(--border) rounded-xl p-4 hover:border-(--accent) transition-colors">
      {/* Top */}
      <div className="flex items-start gap-3 mb-3">

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            <p className="text-sm font-medium text-(--text) leading-snug">{name}</p>

            {isMRF && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-(--accent-bg) text-(--accent)">
                MRF
              </span>
            )}
          </div>

          <p className="text-xs text-(--text2) mt-1">{address}</p>
          <p className="text-xs text-(--muted) mt-0.5">{city}, {state} {zipCode}</p>
        </div>

        <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${STATUS_COLOR[status] ?? 'bg-gray-400'}`} title={status} />
      </div>

      <hr className="border-(--border) mb-3" />

      {/* Contact */}
      <div className="space-y-1">
        {phones[0] && (<p className="text-xs text-(--text2)">📞 {phones[0]}</p>)}
        {faxes[0] && (<p className="text-xs text-(--text2)">📠 {faxes[0]}</p>)}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button
          className="flex-1 text-xs border border-(--border) rounded-lg py-1.5 text-(--text2) hover:bg-(--surface2) cursor-pointer"
        >
          📝 Note
        </button>

        <Link
          to={`/clinics/${clinic._id}`}
          className="flex-1 text-center text-xs bg-(--accent) text-white rounded-lg py-1.5 py-1.5 hover:opacity-90 cursor-pointer"
        >
          View detail
        </Link>
      </div>
    </div>
  )
}