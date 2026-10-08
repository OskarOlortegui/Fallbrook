import { useCallback } from "react";
import { api } from "../services/api";
import { useEntitySearch } from "../hooks/useEntitySearch";
import DoctorCard from "../components/DoctorCard";
//import PageHeader from "../components/PageHeader";

const DOCTOR_SEARCH_FIELDS = [
  'name',
  'gender',
  'specialty',
  'npi',
  'clinics.name',
  'clinics.address',
  'clinics.city',
  'clinics.zipCode',
  'clinics.phones',
  'clinics.faxes',
  'insurances.name',
  'insurances.shortName'
]

export const Doctors = () => {
  const fetchDoctors = useCallback(() => api.getDoctors(), []);
  const { data: doctors, search, setSearch, loading, error } = useEntitySearch(fetchDoctors, DOCTOR_SEARCH_FIELDS);
 
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-medium">All Doctors</h1>

        <p className="text-sm text-(--text2) mt-1">
          {!loading && !error && `${doctors.length} Doctors found`}
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-(--muted) text-sm">🔍</span>

          <input
            type="text"
            placeholder="Search by name, specialty, NPI, city, phone, fax or insurance..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-(--surface) border border-(--border) rounded-xl pl-9 pr-4 py-2.5 text-sm text-(--text) placeholder:text-(--muted) focus:outline-none focus:border-(--accent)"
          />

          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-(--muted) hover:text-(--text2) text-xs"
            >
              ✕ Clear
            </button>
          )}
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-sm text-(--muted)">
          Loading...
        </p>
      )}

      {/* ✅ 2. Componente visual destacado para mostrar el error */}
      {error && !loading && (
        <div className="p-4 mb-4 border border-red-500/20 bg-red-500/10 rounded-xl text-red-500 text-sm flex items-center gap-2">
          <span>⚠️</span>
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}


      {!loading && !error && doctors.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {doctors.map(doctor => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
            />
          ))}
        </div>
      )}
    </div>
  )
}
export default Doctors