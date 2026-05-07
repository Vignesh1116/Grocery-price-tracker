import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import AddProductPage from './pages/AddProductPage';
import EntriesPage from './pages/EntriesPage';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="container mx-auto py-6">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/add" element={<AddProductPage />} />
            <Route path="/entries" element={<EntriesPage />} />

          </Routes>
        </main>
        
        <footer className="mt-20 border-t border-slate-200 py-10 text-center text-slate-500">
          <p>© 2024 Smart Price Tracker. Crowdsourced with love.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
