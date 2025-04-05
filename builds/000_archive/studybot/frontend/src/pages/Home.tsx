import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();

  const featuredTopics = [
    {
      id: 1,
      name: 'RAG Systems',
      description: 'Learn about Retrieval Augmented Generation and how it enhances LLM capabilities.',
      difficulty: 3
    },
    {
      id: 2,
      name: 'Vector Databases',
      description: 'Understand vector databases and their role in modern AI applications.',
      difficulty: 4
    },
    {
      id: 3,
      name: 'LLM Validation',
      description: 'Master techniques for validating and evaluating LLM performance.',
      difficulty: 3
    },
    {
      id: 4,
      name: 'LLM Fine-tuning',
      description: 'Learn how to fine-tune LLMs for specific tasks and domains.',
      difficulty: 5
    },
    {
      id: 5,
      name: 'LLM Orchestration',
      description: 'Explore methods for orchestrating multiple LLMs in complex applications.',
      difficulty: 4
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
          <span className="block">Welcome to</span>
          <span className="block text-indigo-600">LLM Learning Bot</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Master the fundamentals of Large Language Models through interactive quizzes and hands-on learning.
        </p>
        {!user && (
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link
                to="/login"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>

      <div className="mt-12">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
          Featured Topics
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {topic.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {topic.description}
                </p>
                <div className="mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    Difficulty: {topic.difficulty}/5
                  </span>
                </div>
                <div className="mt-6">
                  <Link
                    to={`/quiz/${topic.id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Start Quiz
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Why Learn with LLM Learning Bot?
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Interactive Learning</h3>
              <p className="mt-1 text-sm text-gray-500">
                Engage with dynamic quizzes that adapt to your learning progress.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Comprehensive Coverage</h3>
              <p className="mt-1 text-sm text-gray-500">
                Learn about all aspects of LLMs, from basics to advanced concepts.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Track Progress</h3>
              <p className="mt-1 text-sm text-gray-500">
                Monitor your learning journey with detailed progress tracking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 