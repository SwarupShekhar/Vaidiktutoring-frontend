export default function Loading() {
  return (
    <div 
      className="min-h-screen bg-gray-50 p-6 animate-pulse" 
      role="status" 
      aria-live="polite" 
      aria-busy="true"
    >
      <span className="sr-only">Loading, please wait</span>
      <div className="max-w-5xl mx-auto space-y-4" aria-hidden="true">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl h-24 shadow-sm" />
        ))}
      </div>
    </div>
  );
}
