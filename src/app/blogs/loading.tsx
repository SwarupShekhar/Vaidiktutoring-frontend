export default function Loading() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with substantive content */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-600">
            Latest Insights
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Tips, tricks, and educational resources from our expert tutors. Discover articles on study techniques, subject mastery, and academic success strategies.
          </p>
        </div>

        {/* Loading grid with content placeholders */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden shadow-sm bg-white border">
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded w-full animate-pulse" />
                <div className="h-3 bg-gray-100 rounded w-5/6 animate-pulse" />
                <div className="mt-4 text-sm text-gray-500">
                  Educational content loading...
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional content to avoid thin page */}
        <div className="text-center mt-12">
          <p className="text-text-secondary">
            Stay tuned for the latest updates on tutoring methodologies, exam preparation tips, and student success stories.
          </p>
        </div>
      </div>
    </div>
  );
}
