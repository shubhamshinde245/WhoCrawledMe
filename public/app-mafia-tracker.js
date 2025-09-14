(function() {
    'use strict';

    // Configuration
    const TRACKING_CONFIG = {
        endpoint: 'https://your-whocrawledme-domain.vercel.app/api/track',
        source: 'app-mafia-v2',
        version: '1.0.0',
        debug: false
    };

    // App Mafia specific tracking
    class AppMafiaTracker {
        constructor(config) {
            this.config = config;
            this.sessionId = this.generateSessionId();
            this.startTime = Date.now();
            this.init();
        }

        generateSessionId() {
            return 'appmafia_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }

        init() {
            // Track initial page load
            this.trackEvent('page_view', {
                page_type: this.getPageType(),
                referrer: document.referrer,
                user_agent: navigator.userAgent,
                timestamp: new Date().toISOString()
            });

            // Track content generation events
            this.setupContentGenerationTracking();

            // Track user interactions
            this.setupInteractionTracking();

            // Track AI bot detection
            this.trackAIBotActivity();
        }

        getPageType() {
            const path = window.location.pathname;
            const title = document.title.toLowerCase();

            if (path.includes('/generate') || title.includes('generate')) {
                return 'content_generator';
            } else if (path.includes('/dashboard') || title.includes('dashboard')) {
                return 'dashboard';
            } else if (path === '/') {
                return 'homepage';
            }
            return 'other';
        }

        setupContentGenerationTracking() {
            // Track when content generation starts
            const originalFetch = window.fetch;
            window.fetch = (...args) => {
                const [url, options] = args;

                // Detect AI content generation API calls
                if (url.includes('/api/generate') || url.includes('/generate')) {
                    this.trackEvent('content_generation_start', {
                        api_endpoint: url,
                        method: options?.method || 'GET',
                        timestamp: new Date().toISOString()
                    });
                }

                return originalFetch.apply(window, args).then(response => {
                    // Track successful content generation
                    if ((url.includes('/api/generate') || url.includes('/generate')) && response.ok) {
                        this.trackEvent('content_generation_success', {
                            api_endpoint: url,
                            status: response.status,
                            timestamp: new Date().toISOString()
                        });
                    }
                    return response;
                });
            };
        }

        setupInteractionTracking() {
            // Track copy/download actions
            document.addEventListener('click', (e) => {
                const target = e.target;
                const text = target.textContent?.toLowerCase() || '';
                const className = target.className || '';

                if (text.includes('copy') || text.includes('download') ||
                    className.includes('copy') || className.includes('download')) {
                    this.trackEvent('content_action', {
                        action: text.includes('copy') ? 'copy' : 'download',
                        element: target.tagName,
                        timestamp: new Date().toISOString()
                    });
                }
            });

            // Track form submissions (content generation forms)
            document.addEventListener('submit', (e) => {
                const form = e.target;
                if (form.tagName === 'FORM') {
                    this.trackEvent('form_submit', {
                        form_id: form.id,
                        form_action: form.action,
                        timestamp: new Date().toISOString()
                    });
                }
            });
        }

        trackAIBotActivity() {
            // Detect potential AI bot characteristics
            const botIndicators = {
                headless: navigator.webdriver,
                phantom: window.phantom,
                nightmare: window.__nightmare,
                selenium: window.Selenium || window.webdriver,
                userAgent: /bot|crawl|spider|AI|GPT|Claude|Gemini|Perplexity/i.test(navigator.userAgent),
                webGL: !this.hasWebGL(),
                plugins: navigator.plugins.length === 0,
                languages: navigator.languages.length === 0
            };

            const botScore = Object.values(botIndicators).filter(Boolean).length;

            if (botScore > 0) {
                this.trackEvent('potential_ai_bot', {
                    bot_score: botScore,
                    indicators: botIndicators,
                    confidence: botScore / Object.keys(botIndicators).length,
                    timestamp: new Date().toISOString()
                });
            }
        }

        hasWebGL() {
            try {
                const canvas = document.createElement('canvas');
                return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
            } catch (e) {
                return false;
            }
        }

        trackEvent(eventType, data = {}) {
            const payload = {
                event_type: eventType,
                session_id: this.sessionId,
                source: this.config.source,
                url: window.location.href,
                title: document.title,
                timestamp: new Date().toISOString(),
                screen_resolution: `${screen.width}x${screen.height}`,
                viewport: `${window.innerWidth}x${window.innerHeight}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                ...data
            };

            this.sendData(payload);
        }

        sendData(payload) {
            // Use different methods for better compatibility
            if (navigator.sendBeacon) {
                // Preferred method for page unload events
                navigator.sendBeacon(
                    this.config.endpoint,
                    JSON.stringify(payload)
                );
            } else {
                // Fallback to fetch
                fetch(this.config.endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(payload),
                    mode: 'cors',
                    credentials: 'omit'
                }).catch(error => {
                    if (this.config.debug) {
                        console.error('WhoCrawledMe tracking error:', error);
                    }
                });
            }

            if (this.config.debug) {
                console.log('WhoCrawledMe tracked:', payload);
            }
        }

        // Track page unload
        setupUnloadTracking() {
            const trackUnload = () => {
                const sessionDuration = Date.now() - this.startTime;
                this.trackEvent('page_unload', {
                    session_duration: sessionDuration,
                    timestamp: new Date().toISOString()
                });
            };

            window.addEventListener('beforeunload', trackUnload);
            window.addEventListener('pagehide', trackUnload);
        }
    }

    // Auto-initialize if not already done
    if (!window.WhoCrawledMeTracker) {
        window.WhoCrawledMeTracker = new AppMafiaTracker(TRACKING_CONFIG);
        window.WhoCrawledMeTracker.setupUnloadTracking();
    }

    // Expose tracking function for manual events
    window.trackWhoCrawledMe = function(eventType, data) {
        if (window.WhoCrawledMeTracker) {
            window.WhoCrawledMeTracker.trackEvent(eventType, data);
        }
    };

})();