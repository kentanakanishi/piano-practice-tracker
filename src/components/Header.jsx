import AuthButton from './AuthButton';
import './Header.css';

export default function Header({ view, onViewChange }) {
  return (
    <header className="header">
      <div className="header-top">
        <h1 className="header-title">ピアノ練習トラッカー</h1>
        <AuthButton />
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
    </header>
  );
}
