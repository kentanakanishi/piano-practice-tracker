import './Header.css';

export default function Header({ view, onViewChange }) {
  return (
    <header className="header">
      <h1 className="header-title">ピアノ練習トラッカー</h1>
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
