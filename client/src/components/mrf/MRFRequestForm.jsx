import { useEffect, useState } from 'react'
import { api } from '../../services/api'

export function MRFRequestForm({ clinic, initialRequesting = '' }) {
  const [form, setForm] = useState({
    patientName: '',
    dob: '',
    requesting: '',
    recordsRequested: '',
    fax: '',
  })

  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState('')
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    if (!clinic) return

    setForm(prev => ({
      ...prev,
      requesting: initialRequesting || clinic.name || '',
      fax: clinic.faxes?.[0] || '',
    }))

    setSuccess('')
    setSubmitError('')
  }, [clinic, initialRequesting])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value,
    }))
    setSuccess('')
    setSubmitError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    
    if (!clinic?._id) {
      setSubmitError('Please select a clinic.')
      return
    }

    setSending(true)
    setSuccess('')
    setSubmitError('')

    try {
      await api.downloadMRF(clinic._id, {
        patientName: form.patientName.trim(),
        dob: form.dob,
        requesting: form.requesting.trim(),
        recordsRequested: form.recordsRequested.trim(),
        //esto es nuevo
        fax: form.fax.trim(),
      })

      setSuccess('PDF generated. Check your downloads folder.')
    } catch (err) {
      setSubmitError(
        err.message || 'Unable to generate the MRF PDF.'
      )
    } finally {
      setSending(false)
    }
  }

  if (!clinic) {
    return (
      <div className="bg-(--surface) border border-(--border) rounded-xl p-5 mt-6">
        <p className="text-sm text-(--muted) italic">
          Select a clinic to start generating an MRF request.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-(--surface) border border-(--border) rounded-xl p-5 mt-6">
      <h2 className="text-sm font-medium text-(--text) mb-3">
        Generate MRF Authorization
      </h2>

      {/* <p className="text-xs text-(--muted) mb-4">
        Clinic: {clini c.name}
      </p> */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Name */}
        <div>
          <label htmlFor="patientName"
            className="block text-sm mb-1">
            Patient Name <span className="text-(--danger)">*</span>
          </label>
          <input
            id="patientName"
            name="patientName"
            value={form.patientName}
            onChange={handleChange}
            required
            placeholder="Full name"
            className="w-full bg-(--surface2) border border-(--border) rounded-lg px-3 py-2 text-sm text-(--text) placeholder:text-(--muted) focus:outline-none focus:border-(--accent)"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dob"
            className="block text-sm mb-1">
            Date of Birth <span className="text-(--danger)">*</span>
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            required
            className="w-full bg-(--surface2) border border-(--border) rounded-lg px-3 py-2 text-sm text-(--text) focus:outline-none focus:border-(--accent)"
          />
        </div>

        {/* Requesting */}
        <div>
          <label htmlFor="requesting"
            className="block text-sm mb-1">
            Requesting
          </label>
          <input
            id="requesting"
            name="requesting"
            type="text"
            value={form.requesting}
            onChange={handleChange}
            required
            className="w-full bg-(--surface2) border border-(--border) rounded-lg px-3 py-2 text-sm text-(--text) focus:outline-none focus:border-(--accent)"
          />
        </div>

        {/* Records Requested */}
        <div>
          <label htmlFor="recordsRequested"
            className="block text-sm mb-1">
            Records Requested <span className="text-(--danger)">*</span>
          </label>
          <input
            id="recordsRequested"
            name="recordsRequested"
            value={form.recordsRequested}
            onChange={handleChange}
            required
            placeholder="Last complete discharged notes"
            className="w-full bg-(--surface2) border border-(--border) rounded-lg px-3 py-2 text-sm text-(--text) placeholder:text-(--muted) focus:outline-none focus:border-(--accent)"
          />
        </div>

        {/* Fax */}
        <div>
          <label htmlFor="fax"
            className="block text-sm mb-1">
            Destination Fax <span className="text-(--danger)">*</span>
          </label>
          <input
            id="fax"
            name="fax"
            type="tel"
            value={form.fax}
            onChange={handleChange}
            required
            placeholder="Enter destination fax"
            className="w-full bg-(--surface2) border border-(--border) rounded-lg px-3 py-2 text-sm text-(--text) placeholder:text-(--muted) focus:outline-none focus:border-(--accent)"
          />
        </div>

        {success && (
          <p role="status" className="text-sm text-(--success)">
            {success}
          </p>
        )}

        {submitError && (
          <p role="alert" className="text-sm text-(--danger)">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-(--accent) text-white text-sm rounded-lg py-2.5 font-medium disabled:opacity-50"
        >
          {sending ? 'Generating PDF...' : 'Generate & Download PDF'}
        </button>
      </form>
    </div>
  )
}