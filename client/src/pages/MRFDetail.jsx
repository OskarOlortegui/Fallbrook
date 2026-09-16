import { useParams } from "react-router"

export default function MRFDetail() {
    const {id} = useParams()
    return (
        <h1>MRF Detail page {id}</h1>
    )
}
//es borrador
/* function MRFDetailCard({ mrf }) {
  const {
    _id,
    name,
    address,
    city,
    state,
    zipCode,
    phone,
    fax
  } = mrf

  return (
    <Link
      to={`/clinics/mrf/${_id}`}
      className="bg-(--surface) border border-(--border) rounded-xl p-4 hover:border-(--accent) transition-colors block"
    >

      <div className="mb-3">

        <p className="text-sm font-medium text-(--text) leading-snug">
          {name}
        </p>

        <p className="text-xs text-(--text2) mt-0.5">
          {address}
        </p>

        <p className="text-xs text-(--muted)">
          {city}, {state} {zipCode}
        </p>

      </div>

      <hr className="border-(--border) mb-3" />

      <div className="space-y-1.5 text-xs text-(--text2)">

        {phone ? (
          <p className="flex gap-1.5">
            <span className="text-(--muted)">📞</span>
            <span>{phone}</span>
          </p>
        ) : (
          <p className="text-(--muted) italic">
            No phone
          </p>
        )}

        {fax ? (
          <p className="flex gap-1.5">
            <span className="text-(--muted)">📠</span>
            <span>{fax}</span>
          </p>
        ) : (
          <p className="text-(--muted) italic">
            No fax
          </p>
        )}

      </div>

    </Link>
  )
} */