export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center animate-pulse">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gray-700 rounded-full mx-auto" />
        <div className="h-4 w-40 bg-gray-700 rounded mx-auto" />
        <div className="h-3 w-28 bg-gray-800 rounded mx-auto" />
      </div>
    </div>
  );
}
