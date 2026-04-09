export default function Loading() {
  return (
    <div 
      className="min-h-screen bg-gray-50 p-6 animate-pulse" 
      role="status" 
      aria-live="polite" 
      aria-busy="true"
    >
      <span className="sr-only">Loading dashboard…</span>
      <div className="max-w-7xl mx-auto space-y-6" aria-hidden="true">
        <div className="h-8 w-64 bg-gray-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 h-28 shadow-sm" />
          ))}
        </div>
        <div className="bg-white rounded-xl h-80 shadow-sm" />
      </div>
    </div>
  );
}
