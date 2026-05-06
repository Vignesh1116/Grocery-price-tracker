import { Link } from 'react-router-dom';
import { ShoppingCart, Search, PlusCircle } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 mb-8 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <ShoppingCart className="w-8 h-8 text-primary-600" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            SmartPrice
          </span>
        </Link>
        
        <div className="flex space-x-6">
          <Link to="/" className="flex items-center space-x-1 text-slate-600 hover:text-primary-600 transition-colors font-medium">
            <Search className="w-4 h-4" />
            <span>Search</span>
          </Link>
          <Link to="/add" className="flex items-center space-x-1 text-slate-600 hover:text-primary-600 transition-colors font-medium">
            <PlusCircle className="w-4 h-4" />
            <span>Add Entry</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
