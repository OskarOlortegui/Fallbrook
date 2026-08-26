export default function MRFCard({ facility }) {
  const { name, address, phone, fax } = facility
  return (
    <div className="bg-(--surface) border border-(--border) rounded-xl p-4 hover:border-(--text2) transition-colors cursor-pointer">
      <p className="text-sm font-medium text-(--text) mb-1">{name}</p>
      <p className="text-xs text-(--text2) mb-3">{address}</p>
      <div className="space-y-1.5 text-xs text-(--text2)">
        <p className="flex gap-1.5"><span className="text-(--muted)">📞</span>{phone}</p>
        <p className="flex gap-1.5"><span className="text-(--muted)">📠</span>{fax}</p>
      </div>
    </div>
  )
}