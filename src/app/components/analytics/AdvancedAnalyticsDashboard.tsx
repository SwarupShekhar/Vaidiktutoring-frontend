import React from 'react';

export function AdvancedAnalyticsDashboard() {
  // Mock Data for the Demo - VCE Mathematical Methods
  const curriculum = "VCE Mathematical Methods (Units 1 & 2)";
  const predictedScore = "42"; // ATAR study score usually out of 50
  const predictedBand = "Top 8%";
  
  const syllabusMastery = [
    { topic: "Functions and Graphs", mastery: 92, status: "Mastered" },
    { topic: "Algebra (Polynomials & Transformations)", mastery: 78, status: "On Track" },
    { topic: "Calculus (Differentiation)", mastery: 45, status: "Needs Work" },
    { topic: "Probability and Statistics", mastery: 15, status: "Not Started" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-700 to-indigo-600">
            Advanced Analytics
          </h2>
          <p className="text-gray-500 mt-1">AI-Powered Insights for {curriculum}</p>
          <span className="inline-block mt-2 px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-800 border border-amber-200">
            Sample data — illustrative, not this student&apos;s real analysis
          </span>
        </div>
        <div className="px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600"></span>
          </span>
          <span className="text-sm font-semibold text-indigo-700">Elite Plan Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Predictive Grading Widget */}
        <div className="col-span-1 md:col-span-1 relative overflow-hidden bg-linear-to-br from-indigo-600 to-blue-700 rounded-xl p-6 text-white shadow-xl shadow-indigo-200">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
          </div>
          <h3 className="text-indigo-100 font-medium mb-1">Predicted Study Score</h3>
          <div className="text-6xl font-extrabold mb-2">{predictedScore}<span className="text-2xl text-indigo-200">/50</span></div>
          <p className="text-indigo-100 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Trending upwards • {predictedBand}
          </p>
        </div>

        {/* Engagement Diagnostics */}
        <div className="col-span-1 md:col-span-2 rounded-xl bg-white shadow-sm border border-gray-100 p-6">
          <h3 className="text-gray-700 font-semibold mb-4">Diagnostic Session Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">Problem Solving Speed</div>
              <div className="text-xl font-bold text-gray-800">Fast</div>
              <div className="text-xs text-green-600 mt-1">+12% vs avg</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">Student Talk Time</div>
              <div className="text-xl font-bold text-gray-800">42%</div>
              <div className="text-xs text-gray-500 mt-1">Optimal active learning</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
              <div className="text-sm text-gray-500 mb-1">Hint Dependency</div>
              <div className="text-xl font-bold text-gray-800">Low</div>
              <div className="text-xs text-green-600 mt-1">Highly independent</div>
            </div>
            <div className="p-4 rounded-xl bg-red-50 border border-red-100">
              <div className="text-sm text-red-600 mb-1">Core Weakness</div>
              <div className="text-lg font-bold text-red-700 leading-tight">Differentiation Rules</div>
            </div>
          </div>
        </div>
      </div>

      {/* Syllabus Mastery */}
      <div className="rounded-xl bg-white shadow-sm border border-gray-100 p-6">
        <h3 className="text-gray-700 font-semibold mb-6 flex justify-between items-center">
          <span>Syllabus Coverage & Mastery</span>
          <span className="text-sm font-normal px-3 py-1 bg-gray-100 rounded-full text-gray-600">Unit 1 & 2 Syllabus Map</span>
        </h3>
        
        <div className="space-y-6">
          {syllabusMastery.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="flex justify-between items-end mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">{item.topic}</h4>
                  <p className="text-sm text-gray-500">{item.status}</p>
                </div>
                <div className="text-lg font-bold text-gray-700">{item.mastery}%</div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    item.mastery > 80 ? 'bg-green-500' :
                    item.mastery > 60 ? 'bg-indigo-500' :
                    item.mastery > 30 ? 'bg-amber-400' : 'bg-gray-300'
                  }`}
                  style={{ width: `${item.mastery}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
