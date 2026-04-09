export default function Loading() {
  return (
    <div 
      className="min-h-screen bg-white p-8 animate-pulse" 
      role="status" 
      aria-live="polite" 
      aria-busy="true"
    >
      <span className="sr-only">Loading blogs...</span>
      <div className="max-w-6xl mx-auto space-y-8" aria-hidden="true">
        <div className="h-10 w-72 bg-gray-200 rounded mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow-sm">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
