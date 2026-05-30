import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="lang-toggle-wrapper">
      <button 
        onClick={toggleLanguage}
        className="lang-toggle-btn"
        aria-label="Toggle language"
      >
        <span className={`lang-option ${language === 'en' ? 'active' : ''}`}>EN</span>
        <div className="lang-divider"></div>
        <span className={`lang-option ${language === 'id' ? 'active' : ''}`}>ID</span>
      </button>

      <style>{`
        .lang-toggle-wrapper {
          position: fixed;
          top: 2rem;
          right: 2rem;
          z-index: 9999;
        }

        .lang-toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(232, 200, 255, 0.05);
          border: 1px solid rgba(232, 200, 255, 0.2);
          border-radius: 999px;
          padding: 6px 12px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'DM Sans', sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.6);
        }

        .lang-toggle-btn:hover {
          background: rgba(232, 200, 255, 0.1);
          border-color: rgba(232, 200, 255, 0.4);
          transform: translateY(-2px);
        }

        .lang-option {
          transition: all 0.3s ease;
        }

        .lang-option.active {
          color: #fff;
          text-shadow: 0 0 10px rgba(232, 200, 255, 0.8);
        }

        .lang-divider {
          width: 1px;
          height: 12px;
          background: rgba(232, 200, 255, 0.3);
        }

        @media (max-width: 768px) {
          .lang-toggle-wrapper {
            top: 1.5rem;
            right: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageToggle;
