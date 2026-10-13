import { Link } from 'react-router'

const STATUS_COLOR = {
  active:   'bg-(--success-bg) text-(--success)',
  deleted:  'bg-(--danger-bg) text-(--danger)',
  prohibited: 'bg-(--danger-bg) text-(--danger)',
}

export default function RadiologyCenterCard({ center }) {
  const { _id, name, status, locations = [], website, accountNo } = center

  return (
    <div className="bg-(--surface) border border-(--border) rounded-xl p-4 hover:border-(--accent) transition-colors">

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm font-medium text-(--text) leading-snug">{name}</p>
        {status && (
          <span className={`text-[11px] px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLOR[status] ?? 'bg-(--surface2) text-(--text2)'}`}>
            {status}
          </span>
        )}
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
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-(--border)">
        {website
          ? <a href={website} target="_blank" rel="noreferrer" className="text-xs text-(--accent) hover:underline">🌐 Website</a>
          : <span />
        }
        <Link to={`/radiology-centers/${_id}`} className="text-xs text-(--accent) hover:underline font-medium">
          View details →
        </Link>
      </div>

    </div>
  )
}