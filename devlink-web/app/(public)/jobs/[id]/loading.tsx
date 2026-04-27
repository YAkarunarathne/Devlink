export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="h-8 w-72 bg-gray-200 rounded animate-pulse mb-4" />
      <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mb-8" />
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-100 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}