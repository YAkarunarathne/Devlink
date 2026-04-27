export default function Loading() {
  return (
    <div className="max-w-xl">
      <div className="h-8 w-40 bg-gray-200 rounded animate-pulse mb-8" />
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}