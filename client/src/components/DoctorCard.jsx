function initials(name) {
  return name.replace('Dr. ', '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

const STATUS_COLOR = {
  verified:         'bg-(--success)',
  pending:          'bg-yellow-400',
  'out-of-network': 'bg-orange-400',
  deleted:          'bg-(--danger)',
}

export default function DoctorCard({ doctor }) {
  const { name, specialty, npi, gender, status, insurances = [] } = doctor
  const MAX_INS = 3

  return (
    <div className="bg-(--surface) border border-(--border) rounded-xl p-4 hover:border-(--accent) transition-colors">
      {/* Top */}
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0 ${
          gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-(--accent-bg) text-(--accent)'
        }`}>
          {initials(name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-(--text) leading-snug">{name}</p>
          <p className="text-xs text-(--text2) mt-0.5 capitalize">{specialty}</p>
          <p className="text-[11px] text-(--muted) mt-0.5 font-mono">NPI: {npi}</p>
        </div>
        <div
          className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${STATUS_COLOR[status] ?? 'bg-gray-400'}`}
          title={status}
        />
      </div>

      <hr className="border-(--border) mb-3" />

      {/* Insurances */}
      <div className="flex flex-wrap gap-1">
        {insurances.length > 0 ? (
          <>
            {insurances.slice(0, MAX_INS).map(ins => (
              <span
                key={ins.slug ?? ins.name}
                className="text-[11px] px-2 py-0.5 rounded-full bg-(--accent-bg) text-(--accent) border border-(--border)"
              >
                {ins.shortName ?? ins.name}
              </span>
            ))}
            {insurances.length > MAX_INS && (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-(--surface2) text-(--text2) border border-(--border)">
                +{insurances.length - MAX_INS}
              </span>
            )}
          </>
        ) : (
          <span className="text-[11px] text-(--muted) italic">No insurances</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-3">
        <button className="flex-1 text-xs border border-(--border) rounded-lg py-1.5 text-(--text2) hover:bg-(--surface2) cursor-pointer">
          📝 Note
        </button>
        <button className="flex-1 text-xs bg-(--accent) text-white rounded-lg py-1.5 hover:opacity-90 cursor-pointer">
          View detail
        </button>
      </div>
    </div>
  )
}