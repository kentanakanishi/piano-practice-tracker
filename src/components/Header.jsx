import AuthButton from './AuthButton';
import NotificationSettings from './NotificationSettings';
import './Header.css';

export default function Header({ view, onViewChange, mode, onModeChange, notifSettings, onNotifUpdate, onNotifRequestPermission }) {
  const title = mode === 'piano' ? 'ピアノ練習トラッカー' : '学習履歴トラッカー';

  return (
    <header className="header">
      <div className="header-top">
        <h1 className="header-title">{title}</h1>
        <div className="header-actions">
          <NotificationSettings
            settings={notifSettings}
            onUpdate={onNotifUpdate}
            onRequestPermission={onNotifRequestPermission}
          />
          <AuthButton />
        </div>
      </div>
      <div className="header-controls">
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'piano' ? 'mode-btn--active' : ''}`}
            onClick={() => onModeChange('piano')}
          >
            ピアノ練習
          </button>
          <button
            className={`mode-btn ${mode === 'study' ? 'mode-btn--active' : ''}`}
            onClick={() => onModeChange('study')}
          >
            学習履歴
          </button>
        </div>
        <div className="header-tabs">
          <button
            className={`tab ${view === 'monthly' ? 'tab--active' : ''}`}
            onClick={() => onViewChange('monthly')}
          >
            月別
          </button>
          <button
            className={`tab ${view === 'yearly' ? 'tab--active' : ''}`}
            onClick={() => onViewChange('yearly')}
          >
            年間
          </button>
        </div>
      </div>
    </header>
  );
}
