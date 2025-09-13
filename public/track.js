/**
 * WhoCrawledMe Tracking Script
 * Embed this script on your website to detect AI bot visits
 * 
 * Usage:
 * <script src="https://your-domain.com/track.js"></script>
 * 
 * Or with custom configuration:
 * <script>
 *   window.WhoCrawledMeConfig = {
 *     endpoint: 'https://your-domain.com/api/track',
 *     debug: false
 *   };
 * </script>
 * <script src="https://your-domain.com/track.js"></script>
 */

(function() {
  'use strict';
  
  // Configuration
  const config = window.WhoCrawledMeConfig || {};
  const endpoint = config.endpoint || (function() {
    // Try to auto-detect the endpoint from the script source
    const scripts = document.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src;
      if (src && src.includes('track.js')) {
        const url = new URL(src);
        return url.origin + '/api/track';
      }
    }
    // Fallback - you should replace this with your actual domain
    return 'https://your-whocrawledme-domain.com/api/track';
  })();
  
  const debug = config.debug || false;
  
  function log(message, data) {
    if (debug) {
      console.log('[WhoCrawledMe]', message, data || '');
    }
  }
  
  function collectData() {
    return {
      url: window.location.href,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }
  
  function sendTracking() {
    try {
      const data = collectData();
      log('Sending tracking data', data);
      
      // Use fetch if available
      if (typeof fetch !== 'undefined') {
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
          mode: 'cors'
        }).then(function(response) {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok');
        }).then(function(result) {
          log('Tracking successful', result);
          if (result.detected) {
            log('Bot detected:', result.botType + ' (confidence: ' + result.confidence + ')');
          }
        }).catch(function(error) {
          log('Tracking failed', error);
          // Fallback to pixel tracking
          fallbackPixelTracking();
        });
      } else {
        // Fallback for older browsers
        fallbackPixelTracking();
      }
    } catch (error) {
      log('Error in sendTracking', error);
      fallbackPixelTracking();
    }
  }
  
  function fallbackPixelTracking() {
    try {
      const img = new Image();
      img.style.display = 'none';
      img.src = endpoint + '?url=' + encodeURIComponent(window.location.href) + 
                '&ref=' + encodeURIComponent(document.referrer) + 
                '&t=' + Date.now();
      
      // Clean up after a few seconds
      setTimeout(function() {
        if (img.parentNode) {
          img.parentNode.removeChild(img);
        }
      }, 5000);
      
      log('Fallback pixel tracking sent');
    } catch (error) {
      log('Fallback tracking failed', error);
    }
  }
  
  // Wait for DOM to be ready
  function ready(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }
  
  // Initialize tracking
  ready(function() {
    // Small delay to ensure page is fully loaded
    setTimeout(sendTracking, 100);
  });
  
  // Export for manual triggering if needed
  window.WhoCrawledMe = {
    track: sendTracking,
    config: config
  };
  
  log('WhoCrawledMe tracking script loaded');
})();