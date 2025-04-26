import { useEffect, useState } from 'react';

function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  return (
    deferredPrompt && (
      <button
        onClick={handleInstallClick}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '10px 20px',
          background: '#1976d2',
          color: '#fff',
          borderRadius: '10px',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Install App
      </button>
    )
  );
}

export default InstallPWA;
