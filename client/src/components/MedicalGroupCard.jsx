import { Link } from 'react-router'

const STATUS_COLOR = {
verified: 'bg-(--success) ',
pending: 'bg-yellow-400',
'out-of-network': 'bg-orange-400',
deleted: 'bg-(--danger)',
}

export default function MedicalGroupCard({ group }) {
const {
_id,
name,
phones = [],
faxes = [],
website,
status,
} = group

return (
<article className="bg-(--surface) border border-(--border) rounded-xl p-4 hover:border-(--accent) transition-colors">

  {/* Header */}
  <div className="flex items-start gap-3 mb-3">

    <div className="flex-1 min-w-0">
      <h2 className="text-sm font-medium text-(--text)">
        {name}
      </h2>
    </div>

    <span
      className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${
        STATUS_COLOR[status] ?? 'bg-gray-400'
      }`}
      title={status}
    />
  </div>

  <hr className="border-(--border) mb-3" />

  {/* Contact information */}
  <div className="space-y-2 text-xs text-(--text2)">
    {phones.map((phone, index) => (
      <p key={`${phone}-${index}`}>
        📞 {phone}
      </p>
    ))}

    {faxes.map((fax, index) => (
      <p key={`${fax}-${index}`}>
        📠 {fax}
      </p>
    ))}

    {website && (
      <a
        href={website}
        target="_blank"
        rel="noreferrer"
        className="block text-(--accent) hover:underline truncate"
      >
        🌐 {website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
      </a>
    )}

    {phones.length === 0 &&
      faxes.length === 0 &&
      !website && (
        <p className="text-(--muted) italic">
          No contact information
        </p>
      )}
  </div>

  {/* Actions */}
  <div className="flex gap-2 mt-4">
    <Link
      to={`/medical-groups/${_id}`}
      className="flex-1 text-center text-xs bg-(--accent) text-white rounded-lg py-2 hover:opacity-90"
    >
      View detail
    </Link>
  </div>

</article>

)
}