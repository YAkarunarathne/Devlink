export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="border rounded-xl p-5">
            <div className="h-5 w-64 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}