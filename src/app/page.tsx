'use client';

import { useState } from 'react';
import Dashboard from './components/Dashboard';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { Bot, BarChart3, Activity, Zap } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState('analytics');

  const tabs = [
    { id: 'dashboard', label: 'Live Dashboard', icon: Activity },
    { id: 'analytics', label: 'AI Intelligence', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold gradient-text">WhoCrawledMe</h1>
                  <p className="text-sm text-gray-600">AI Platform Intelligence</p>
                </div>
              </div>
              <span className="ml-4 px-3 py-1 text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full border border-blue-200">
                <Zap className="w-3 h-3 inline mr-1" />
                v3.0 Pro
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">25+ AI Platforms</div>
                <div className="text-xs text-gray-500">Real-time monitoring</div>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="border-b border-gray-200/50">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 py-3 px-1 border-b-2 font-medium text-sm transition-all duration-200
                      ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50/50'
                      }
                    `}
                  >
                    <IconComponent className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'analytics' && <AnalyticsDashboard timeRange="7d" />}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-white/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">
                © 2024 WhoCrawledMe. AI Platform Intelligence System.
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Monitoring ChatGPT, Claude, Gemini, Perplexity &amp; 20+ more AI platforms
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
