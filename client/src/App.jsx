import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import GeneratorPage from './pages/GeneratorPage';
import MyReportsPage from './pages/MyReportsPage';
import MyTemplatesPage from './pages/MyTemplatesPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main>
          <Routes>
            <Route path="/" element={<GeneratorPage />} />
            <Route path="/reports" element={<MyReportsPage />} />
            <Route path="/templates" element={<MyTemplatesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
