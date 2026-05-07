import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, Phone, TrendingDown, Info, Calendar } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userCoords, setUserCoords] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (err) => console.error("Error getting location:", err)
      );
    }
  }, []);

  const getDirectionsUrl = (shopLocation) => {
    const destination = encodeURIComponent(shopLocation);
    if (userCoords) {
      return `https://www.google.com/maps/dir/?api=1&origin=${userCoords.lat},${userCoords.lng}&destination=${destination}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${destination}`;
  };

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      handleSearch(null, query);
    }
  }, [searchParams]);

  const handleSearch = async (e, forcedTerm = null) => {
    if (e) e.preventDefault();
    const term = forcedTerm || searchTerm;
    if (!term.trim()) return;

    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/search?name=${term}`);
      setResults(response.data);
    } catch (err) {
      setError('Failed to fetch products. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 animate-fade-in">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
          Find the Best Prices Near You
        </h1>
        <p className="text-slate-600 text-lg">
          Search for products and compare prices across different local shops.
        </p>
        {userCoords && (
          <div className="mt-4 inline-flex items-center bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100 animate-pulse">
            <MapPin className="w-3 h-3 mr-1" /> Location Active (Using for distances)
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="What are you looking for? (e.g. Rice, Milk, Soap)"
            className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg text-lg pl-14"
          />
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
          <button
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-md"
          >
            Search
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      {results && results.products.length > 0 && (
        <div className="space-y-8 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center space-x-4 shadow-sm">
              <div className="bg-emerald-500 p-3 rounded-xl text-white">
                <TrendingDown className="w-6 h-6" />
              </div>
              <div>
                <p className="text-emerald-800 font-semibold text-sm">Cheapest Option</p>
                <p className="text-2xl font-bold text-emerald-950">
                  ₹{results.products[0].price} <span className="text-sm font-normal">/{results.products[0].unit}</span>
                </p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-center space-x-4 shadow-sm">
              <div className="bg-blue-500 p-3 rounded-xl text-white">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <p className="text-blue-800 font-semibold text-sm">Average Price</p>
                <p className="text-2xl font-bold text-blue-950">
                  ₹{results.average_price} <span className="text-sm font-normal">across {results.products.length} entries</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">Product</th>
                    <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">Price per Unit</th>
                    <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">Shop</th>
                    <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">Location</th>
                    <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">Date</th>
                    <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {results.products.map((product) => (
                    <tr key={product.id} className={`hover:bg-slate-50 transition-colors ${product.id === results.cheapest_id ? 'bg-emerald-50/30' : ''}`}>
                      <td className="px-6 py-6 font-medium text-slate-900">{product.product_name}</td>
                      <td className="px-6 py-6">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-slate-900">₹{product.price}</span>
                          <span className="text-slate-500 text-sm">/ {product.unit}</span>
                          {product.id === results.cheapest_id && (
                            <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              Cheapest
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 font-medium text-slate-700">{product.shop_name}</td>
                      <td className="px-6 py-6">
                        <a 
                          href={getDirectionsUrl(product.shop_location)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-primary-600 hover:text-primary-700 font-medium group transition-colors"
                          title="Get directions in Google Maps"
                        >
                          <MapPin className="w-4 h-4 mr-1 text-primary-500 group-hover:scale-110 transition-transform" />
                          <span className="border-b border-transparent group-hover:border-primary-600">
                            {product.shop_location}
                          </span>
                        </a>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center text-slate-500 text-sm whitespace-nowrap">
                          <Calendar className="w-4 h-4 mr-1 text-slate-400" />
                          {product.bill_date ? new Date(product.bill_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        {product.mobile_number ? (
                          <div className="flex items-center text-slate-500 text-sm">
                            <Phone className="w-4 h-4 mr-1 text-slate-400" />
                            {product.mobile_number}
                          </div>
                        ) : (
                          <span className="text-slate-300 italic text-sm">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {results && results.products.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-500 text-xl font-medium">No products found for "{searchTerm}"</p>
          <p className="text-slate-400 mt-2">Try searching for something else or add a new entry.</p>
        </div>
      )}
    </div>
  );
}
