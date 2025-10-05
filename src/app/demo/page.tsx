'use client';

import { useState, useEffect } from 'react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export default function DemoPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions');
      const result = await response.json();
      
      if (result.success) {
        setQuestions(result.data);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading demo data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🎯 Quiz Application Demo
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              A modern quiz application with comprehensive admin panel
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="/quiz"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                🎮 Take Quiz
              </a>
              <a
                href="/admin"
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                🔧 Admin Panel
              </a>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                🎮 Quiz Features
              </h2>
              <ul className="space-y-2 text-blue-800">
                <li>✅ Interactive question interface</li>
                <li>✅ Real-time timer</li>
                <li>✅ Progress tracking</li>
                <li>✅ Instant scoring</li>
                <li>✅ Responsive design</li>
                <li>✅ Results page with feedback</li>
              </ul>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-green-900 mb-4">
                🔧 Admin Features
              </h2>
              <ul className="space-y-2 text-green-800">
                <li>✅ Web-based admin panel</li>
                <li>✅ Add/Edit/Delete questions</li>
                <li>✅ Real-time updates</li>
                <li>✅ Form validation</li>
                <li>✅ Command line tools</li>
                <li>✅ RESTful API</li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📊 Current Database Status
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{questions.length}</div>
                <div className="text-gray-600">Total Questions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">4</div>
                <div className="text-gray-600">Options per Question</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">SQLite</div>
                <div className="text-gray-600">Database</div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🚀 Quick Start Commands
            </h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <div className="mb-2"># Install dependencies</div>
              <div className="mb-2">npm install</div>
              <div className="mb-2"># Start development server</div>
              <div className="mb-2">npm run dev</div>
              <div className="mb-2"># Access admin panel</div>
              <div>http://localhost:3000/admin</div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              🛠️ Database Management Commands
            </h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
              <div className="mb-2">npm run db:add      # Add questions interactively</div>
              <div className="mb-2">npm run db:list     # List all questions</div>
              <div className="mb-2">npm run db:update 1 # Update question #1</div>
              <div className="mb-2">npm run db:delete 5 # Delete question #5</div>
              <div className="mb-2">npm run db:count    # Show total count</div>
              <div>npm run db:clear    # Clear all questions</div>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              📱 Sample Questions Preview
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {questions.slice(0, 4).map((question) => (
                <div key={question.id} className="bg-white border rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {question.text}
                  </h3>
                  <div className="space-y-1">
                    {question.options.map((option, index) => (
                      <div
                        key={index}
                        className={`text-sm p-2 rounded ${
                          index === question.correctAnswer
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <span className="font-medium">
                          {String.fromCharCode(65 + index)}:
                        </span> {option}
                        {index === question.correctAnswer && (
                          <span className="ml-2 text-green-600">✓</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Ready to explore the full application?
            </p>
            <div className="flex justify-center space-x-4">
              <a
                href="/quiz"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                🎮 Start Quiz
              </a>
              <a
                href="/admin"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                🔧 Open Admin Panel
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
