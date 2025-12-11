import React from 'react';

// Placeholder Search Page
export default function SearchPage({ searchParams }: { searchParams: { subject?: string } }) {
    return (
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] pt-32 px-4 flex flex-col items-center">
            <div className="max-w-4xl w-full text-center">
                <h1 className="text-4xl font-bold mb-4">Search Results</h1>
                <p className="opacity-70 mb-8">
                    Showing results for subject ID: <span className="font-mono bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">{searchParams.subject || 'All'}</span>
                </p>

                <div className="p-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center text-center opacity-50">
                    <span className="text-6xl mb-4">🔍</span>
                    <h2 className="text-2xl font-semibold">Search functionality coming soon!</h2>
                    <p>We are currently indexing our tutors and resources.</p>
                </div>
            </div>
        </div>
    );
}
