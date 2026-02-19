import { useState, useEffect } from 'react';
import { usePracticeData } from './hooks/usePracticeData';
import { useNotification } from './hooks/useNotification';
import Header from './components/Header';
import PracticeForm from './components/PracticeForm';
import MonthlyCalendar from './components/MonthlyCalendar';
import YearlyHeatmap from './components/YearlyHeatmap';
import Stats from './components/Stats';
import './App.css';

const MODE_KEY = 'tracker-mode';

function loadMode() {
  const stored = localStorage.getItem(MODE_KEY);
  return stored === 'study' ? 'study' : 'piano';
}

export default function App() {
  const [mode, setMode] = useState(loadMode);
  const [view, setView] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState(null);

  const { data, addEntry, removeEntry } = usePracticeData(mode);
  const { settings: notifSettings, updateSettings: updateNotifSettings, requestPermission } = useNotification(data, mode);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
  }, [mode]);

  function handleModeChange(newMode) {
    setMode(newMode);
    localStorage.setItem(MODE_KEY, newMode);
    setSelectedDate(null);
  }

  return (
    <div className="app">
      <Header
        view={view}
        onViewChange={setView}
        mode={mode}
        onModeChange={handleModeChange}
        notifSettings={notifSettings}
        onNotifUpdate={updateNotifSettings}
        onNotifRequestPermission={requestPermission}
      />
      <PracticeForm
        data={data}
        selectedDate={selectedDate}
        onAdd={addEntry}
        onRemove={removeEntry}
        mode={mode}
      />
      {view === 'monthly' ? (
        <MonthlyCalendar data={data} onDateSelect={setSelectedDate} />
      ) : (
        <YearlyHeatmap data={data} />
      )}
      <Stats data={data} mode={mode} />
    </div>
  );
}
