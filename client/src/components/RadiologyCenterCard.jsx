import { Link } from 'react-router'

const STATUS_COLOR = {
  verified:         'bg-(--success)',
  pending:          'bg-yellow-400',
  'out-of-network': 'bg-orange-400',
  deleted:          'bg-(--danger)',
}

export default function RadiologyCenterCard({ center }) {
  const { _id, name, status, locations = [], website, accountNo } = center

  return (
    <div className="bg-(--surface) border border-(--border) rounded-xl p-4 hover:border-(--accent) transition-colors">

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm font-medium text-(--text) leading-snug">{name}</p>
        <span
          className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${STATUS_COLOR[status] ?? 'bg-gray-400'
            }`}
          title={status}
        />
      </div>

      {accountNo && (
        <p className="text-xs text-(--muted) mb-3">Account #: {accountNo}</p>
      )}

      <hr className="border-(--border) mb-3" />

      {/* Locations */}
      <div className="space-y-3">
        {locations.length > 0
          ? locations.slice(0, 1).map((loc, i) => (
              <div key={loc._id ?? i} className="text-xs text-(--text2) space-y-0.5">
                {loc.LocationName && (
                  <p className="font-medium text-(--text)">{loc.LocationName}</p>
                )}
                {loc.address && <p>{loc.address}</p>}
                {loc.city    && <p className="text-(--muted)">{loc.city}</p>}
                {loc.phones?.[0] && (
                  <p className="flex gap-1.5 mt-1">
                    <span className="text-(--muted)">📞</span>{loc.phones[0]}
                  </p>
                )}
                {loc.faxes?.[0] && (
                  <p className="flex gap-1.5">
                    <span className="text-(--muted)">📠</span>{loc.faxes[0]}
                  </p>
                )}
              </div>
            ))
          : <p className="text-xs text-(--muted) italic">No locations available</p>
        }
        {locations.length > 2 && (
          <p className="text-xs text-(--muted)">+{locations.length - 2} more locations</p>
        )}
      </div>

      {/* Footer */}
      <div className="flex gap-2 items-center justify-between mt-4 pt-3 border-t border-(--border)">
        {website
          ? <a href={website} target="_blank" rel="noreferrer" className="text-xs text-(--accent) hover:underline">🌐 Website</a>
          : <span />
        }
        <button className="flex-1 text-xs border border-(--border) rounded-lg py-1.5 text-(--text2) hover:bg-(--surface2) cursor-pointer">
          📝 Note
        </button>
        <Link to={`/radiology-centers/${_id}`} className="flex-1 text-xs text-center bg-(--accent) text-white rounded-lg py-1.5 hover:opacity-90 cursor-pointer">
          View details →
        </Link>
      </div>

    </div>
  )
}