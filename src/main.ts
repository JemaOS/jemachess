/**
 * Chess Royale - Main Entry Point
 *
 * A peer-to-peer chess game with glassmorphism UI,
 * featuring multiple piece themes and WebRTC networking.
 *
 * Uses ULTIMATE responsive solution 2025 for all devices.
 */

import { App } from './app';
import { initResponsiveManager } from './utils/ResponsiveManager';
import {
  initServiceWorker,
  onUpdateAvailable,
  onOfflineReady,
  applyUpdate,
  pwaInstaller,
  isOnline,
  onConnectivityChange,
} from './utils/pwa';
import { Toast } from './ui/components/Toast';
import './ui/styles/index.css';

// Application instance
let app: App | null = null;

// Responsive manager instance (ULTIMATE 2025 solution)
const responsiveManager = initResponsiveManager();

/**
 * Initialize the application when DOM is ready
 */
async function initializeApp(): Promise<void> {
  const container = document.getElementById('app');
  
  if (!container) {
    console.error('App container not found');
    showErrorMessage('Application container not found. Please refresh the page.');
    return;
  }
  
  try {
    // Force initial responsive state application
    responsiveManager.forceUpdate();
    
    // Subscribe to responsive changes for logging
    responsiveManager.subscribe((state) => {
      console.log(
        '[Responsive]',
        state.deviceType,
        `${state.width}x${state.height}`,
        `board: ${state.optimalBoardSize}px`,
        state.isPortrait ? 'portrait' : 'landscape',
        state.isFoldable ? '(foldable)' : ''
      );
    });
    
    // Create and initialize the app
    app = new App(container);
    await app.init();
    
    console.log('JemaChess initialized successfully');
  } catch (error) {
    console.error('Failed to initialize JemaChess:', error);
    showErrorMessage('Failed to initialize the application. Please refresh the page.');
  }
}

/**
 * Show an error message to the user
 * @param message The error message to display
 */
function showErrorMessage(message: string): void {
  const container = document.getElementById('app');
  if (container) {
    container.innerHTML = `
      <div class="error-container">
        <div class="error-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
        </div>
        <h2>Erreur de chargement</h2>
        <p>${message}</p>
        <button class="glass-button primary" onclick="location.reload()">
          Rafra\u00EEchir la page
        </button>
      </div>
    `;
  }
}

/**
 * Initialize PWA: service worker, updates, and install prompt
 */
function initPWA(): void {
  // Register the service worker via vite-plugin-pwa
  initServiceWorker();

  // Initialize the install prompt handler
  pwaInstaller.init();

  // When a new version is available, show an update toast
  onUpdateAvailable(() => {
    showUpdateToast();
  });

  // When the app is ready for offline use (first install)
  onOfflineReady(() => {
    Toast.success('JemaChess est disponible hors ligne !', 4000);
  });

  // Monitor connectivity and show status changes
  onConnectivityChange((online) => {
    if (online) {
      Toast.success('Connexion r\u00E9tablie', 3000);
    } else {
      Toast.warning('Vous \u00EAtes hors ligne. Le jeu continue en mode local.', 5000);
    }
  });

  // Show initial offline warning if already offline
  if (!isOnline()) {
    Toast.warning('Vous \u00EAtes hors ligne. Le jeu fonctionne en mode local.', 5000);
  }
}

/**
 * Show a persistent update notification with action button
 */
function showUpdateToast(): void {
  const toast = Toast.getInstance();
  
  // Create a custom toast with an update button
  const container = document.querySelector('.toast-container') || document.body;
  
  const updateBanner = document.createElement('div');
  updateBanner.className = 'toast info show update-toast';
  updateBanner.innerHTML = `
    <span class="toast-icon">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 10v-1a6 6 0 0112 0v1m-4-6V1m0 0L9 4m3-3l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </span>
    <span class="toast-message">Mise \u00E0 jour disponible !</span>
    <button class="update-btn" style="
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
      padding: 4px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      margin-left: 8px;
      transition: background 0.2s;
    ">Mettre \u00E0 jour</button>
    <button class="toast-dismiss">&times;</button>
  `;

  // Handle update click
  const updateBtn = updateBanner.querySelector('.update-btn');
  if (updateBtn) {
    updateBtn.addEventListener('click', async () => {
      updateBtn.textContent = 'Mise \u00E0 jour...';
      await applyUpdate();
    });
  }

  // Handle dismiss
  const dismissBtn = updateBanner.querySelector('.toast-dismiss');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      updateBanner.classList.remove('show');
      setTimeout(() => updateBanner.remove(), 300);
    });
  }

  container.appendChild(updateBanner);
}

/**
 * Handle beforeunload event to clean up resources
 */
function handleBeforeUnload(): void {
  if (app) {
    app.destroy();
    app = null;
  }
}

/**
 * Handle visibility change for app lifecycle
 */
function handleVisibilityChange(): void {
  if (document.visibilityState === 'hidden') {
    console.log('App hidden');
  } else {
    console.log('App visible');
  }
}

// ============================================
// Event Listeners
// ============================================

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM is already ready
  initializeApp();
}

// Initialize PWA after page load (SW registration, update checks, etc.)
window.addEventListener('load', initPWA);

// Clean up on page unload
window.addEventListener('beforeunload', handleBeforeUnload);

// Handle visibility changes
document.addEventListener('visibilitychange', handleVisibilityChange);

// Export app instance for debugging in development
declare global {
  interface Window {
    chessApp?: App | null;
  }
}

// Use try-catch to handle environments where import.meta.env might not exist
try {
  if (typeof import.meta !== 'undefined' && (import.meta as { env?: { DEV?: boolean } }).env?.DEV) {
    window.chessApp = app;
  }
} catch {
  // Ignore in production
}
