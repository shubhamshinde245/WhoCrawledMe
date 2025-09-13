"use client";

import { useState } from "react";
import Dashboard from "./components/Dashboard";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import { Bot, BarChart3, Activity, Zap } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState("analytics");

  const tabs = [
    { id: "dashboard", label: "Live Dashboard", icon: Activity },
    { id: "analytics", label: "AI Intelligence", icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen">
      <header className="glass-morphism-light dark:glass-morphism-dark shadow-lg border-b border-white/20 dark:border-white/10 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-all duration-300 group-hover:scale-110">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    WhoCrawledMe
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    AI Platform Intelligence
                  </p>
                </div>
              </div>
              <span className="ml-4 px-3 py-1 text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 text-indigo-800 dark:text-indigo-200 rounded-full border border-indigo-200 dark:border-indigo-700 hover:shadow-md transition-all duration-200">
                <Zap className="w-3 h-3 inline mr-1" />
                v3.0 Pro
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-semibold text-foreground">
                  25+ AI Platforms
                </div>
                <div className="text-xs text-muted-foreground">
                  Real-time monitoring
                </div>
              </div>
              <div className="relative">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border/50">
            <nav className="-mb-px flex space-x-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group relative flex items-center gap-2 py-3 px-4 rounded-t-lg font-semibold text-sm transition-all duration-300 hover:scale-105
                      ${
                        activeTab === tab.id
                          ? "bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500 shadow-lg"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border-b-2 border-transparent hover:border-muted-foreground/30"
                      }
                    `}
                  >
                    <IconComponent
                      className={`w-4 h-4 transition-all duration-300 ${
                        activeTab === tab.id
                          ? "text-indigo-500"
                          : "group-hover:scale-110"
                      }`}
                    />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-t-lg -z-10"></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "analytics" && <AnalyticsDashboard />}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-morphism-light dark:glass-morphism-dark border-t border-border/50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 group">
              <Bot className="w-5 h-5 text-muted-foreground group-hover:text-indigo-500 transition-colors duration-200" />
              <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                © 2024 WhoCrawledMe. AI Platform Intelligence System.
              </span>
            </div>
            <div className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200">
              Monitoring ChatGPT, Claude, Gemini, Perplexity &amp; 20+ more AI
              platforms
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
