'use client';

import { useState, useEffect } from 'react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export default function AdminPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [formData, setFormData] = useState({
    text: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      const response = await fetch('/api/admin/questions');
      const result = await response.json();
      
      if (result.success) {
        setQuestions(result.data);
      } else {
        console.error('Error loading questions:', result.error);
        alert('Error loading questions: ' + result.error);
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      alert('Error loading questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let response;
      
      if (editingQuestion) {
        // Update existing question
        response = await fetch(`/api/admin/questions/${editingQuestion.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      } else {
        // Add new question
        response = await fetch('/api/admin/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
      }
      
      const result = await response.json();
      
      if (result.success) {
        if (editingQuestion) {
          alert('Question updated successfully!');
          setEditingQuestion(null);
        } else {
          alert(`Question added successfully with ID: ${result.data.id}`);
          setShowAddForm(false);
        }
        
        // Reset form
        setFormData({
          text: '',
          options: ['', '', '', ''],
          correctAnswer: 0
        });
        
        // Reload questions
        loadQuestions();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Error saving question');
    }
  };

  const handleEdit = (question: Question) => {
    setEditingQuestion(question);
    setFormData({
      text: question.text,
      options: [...question.options],
      correctAnswer: question.correctAnswer
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      try {
        const response = await fetch(`/api/admin/questions/${id}`, {
          method: 'DELETE',
        });
        
        const result = await response.json();
        
        if (result.success) {
          alert('Question deleted successfully!');
          loadQuestions();
        } else {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        alert('Error deleting question');
      }
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  if (loading) {
    return <div className="p-8">Loading questions...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Quiz Database Admin</h1>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingQuestion(null);
                setFormData({
                  text: '',
                  options: ['', '', '', ''],
                  correctAnswer: 0
                });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {showAddForm ? 'Cancel' : 'Add Question'}
            </button>
          </div>

          {showAddForm && (
            <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg bg-gray-50">
              <h2 className="text-xl font-semibold mb-4">
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Text
                </label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {formData.options.map((option, index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Option {String.fromCharCode(65 + index)}
                    </label>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(index, e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correct Answer
                </label>
                <select
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: parseInt(e.target.value) })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={0}>A</option>
                  <option value={1}>B</option>
                  <option value={2}>C</option>
                  <option value={3}>D</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingQuestion ? 'Update Question' : 'Add Question'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingQuestion(null);
                    setFormData({
                      text: '',
                      options: ['', '', '', ''],
                      correctAnswer: 0
                    });
                  }}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="mb-4">
            <p className="text-gray-600">Total Questions: {questions.length}</p>
          </div>

          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{question.text}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(question)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(question.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        index === question.correctAnswer
                          ? 'bg-green-100 text-green-800 border border-green-300'
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

          {questions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No questions found. Add your first question to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

