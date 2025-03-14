// Register the service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered successfully with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  });
}

// PWA installation prompt
let deferredPrompt;
const installButton = document.getElementById('pwa-install-button');

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent the default prompt display
  e.preventDefault();
  // Store the event for later use
  deferredPrompt = e;
  
  // Show the install button if it exists
  if (installButton) {
    installButton.style.display = 'block';
    
    // Add click event for installation
    installButton.addEventListener('click', () => {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for user's choice
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA installation');
          // Hide the button after installation
          installButton.style.display = 'none';
        } else {
          console.log('User declined the PWA installation');
        }
        // Reset the deferred prompt
        deferredPrompt = null;
      });
    });
  }
});

// Hide the install button if app is already installed
window.addEventListener('appinstalled', (e) => {
  console.log('App was installed');
  if (installButton) {
    installButton.style.display = 'none';
  }
  deferredPrompt = null;
}); 