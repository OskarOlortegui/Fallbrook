import { Link } from 'react-router'

export default function Footer() {

  const links = [
    { label: 'Doctors', path: '/doctors' },
    { label: 'Clinics', path: '/clinics' },
    { label: 'Insurances', path: '/insurances' },
    { label: 'Radiology', path: '/radiology' },
    { label: 'MRF', path: '/clinics/mrf' }
  ]

  return (
    <footer className="border-t border-(--border) px-6 py-4 flex items-center justify-between text-xs text-(--muted)">
      <div className="flex gap-4">

        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className="hover:text-(--text2) cursor-pointer"
          >
            {link.label}
          </Link>
        ))}

      </div>

      <span>
        Fallbrook Backoffice © {new Date().getFullYear()}
      </span>
    </footer>
  )
}