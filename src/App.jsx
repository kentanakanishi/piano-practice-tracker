import { useState } from 'react';
import { usePracticeData } from './hooks/usePracticeData';
import Header from './components/Header';
import PracticeForm from './components/PracticeForm';
import MonthlyCalendar from './components/MonthlyCalendar';
import YearlyHeatmap from './components/YearlyHeatmap';
import Stats from './components/Stats';
import './App.css';

export default function App() {
  const { data, addEntry, removeEntry } = usePracticeData();
  const [view, setView] = useState('monthly');
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div className="app">
      <Header view={view} onViewChange={setView} />
      <PracticeForm
        data={data}
        selectedDate={selectedDate}
        onAdd={addEntry}
        onRemove={removeEntry}
      />
      {view === 'monthly' ? (
        <MonthlyCalendar data={data} onDateSelect={setSelectedDate} />
      ) : (
        <YearlyHeatmap data={data} />
      )}
      <Stats data={data} />
    </div>
  );
}
