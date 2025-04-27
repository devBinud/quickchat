import { useEffect, useState } from 'react';
import './InstallPWA.css';
import waveImage from "../assets/images/icon/qcicon.png"


function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installStatus, setInstallStatus] = useState('');

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          setInstallStatus('App installed successfully!');
        } else {
          setInstallStatus('App installation was dismissed.');
        }
        setDeferredPrompt(null);

        setTimeout(() => {
          setInstallStatus('');
        }, 2500);
      });
    }
  };

  return (
    <div>
      {deferredPrompt && (
        <button onClick={handleInstallClick} className="install-btn animate-slide-in">
          <img src={waveImage} alt="Install Prompt" className="install-img" />
          Install App
        </button>
      )}

      {installStatus && (
        <div className="install-toast animate-toast">
          {installStatus}
        </div>
      )}
    </div>
  );
}

export default InstallPWA;
