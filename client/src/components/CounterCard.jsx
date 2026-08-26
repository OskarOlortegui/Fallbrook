export default function CounterCard({ label, count, icon, danger }) {
  return (
    <div className={`bg-(--surface) rounded-xl p-4 border cursor-pointer transition-colors hover:border-(--accent) ${
      danger ? 'border-(--danger)' : 'border-(--border)'
    }`}>
      <p className={`text-xs mb-1.5 flex items-center gap-1.5 ${
        danger ? 'text-(--danger)' : 'text-(--text2)'
      }`}>
        <span>{icon}</span> {label}
      </p>
      <p className={`text-2xl font-medium ${
        danger ? 'text-(--danger)' : 'text-(--text)'
      }`}>
        {count}
      </p>
    </div>
  )
}