export default function PageHeader({ title, count, entityName = 'item', loading }) {
  return (
    <div className="mb-6">
      <h1 className="text-xl font-medium">{title}</h1>
      <p className="text-sm text-(--text2) mt-1">
        {!loading && `${count} ${count === 1 ? entityName : `${entityName}s`} found`}
      </p>
    </div>
  );
}