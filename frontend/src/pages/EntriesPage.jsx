import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Phone, Calendar, Trash2, LayoutList, Loader2, AlertCircle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function EntriesPage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/`);
      setEntries(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load entries. Please check if the server is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/products/${productId}`);
      setEntries(prevEntries => prevEntries.filter(e => e.id !== productId));
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Error during delete:', err);
      alert('Failed to delete the entry. Please check if the server is running.');
    }
  };


  return (
    <div className="max-w-7xl mx-auto px-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 flex items-center">
            <LayoutList className="w-10 h-10 mr-4 text-primary-600" />
            All Entries
          </h1>
          <p className="text-slate-600 text-lg">
            Manage all the grocery price entries contributed to the platform.
          </p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center space-x-4">
          <div className="text-right">
            <p className="text-slate-500 text-sm font-medium">Total Entries</p>
            <p className="text-2xl font-bold text-primary-600">{entries.length}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading entries...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-8 rounded-2xl flex items-center space-x-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <div>
            <p className="font-bold text-lg">Error</p>
            <p>{error}</p>
            <button 
              onClick={fetchEntries}
              className="mt-4 text-red-700 font-bold underline hover:no-underline"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : entries.length > 0 ? (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden mb-20">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">Product</th>
                  <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">Price per Unit</th>
                  <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">Shop & Location</th>
                  <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">Date</th>
                  <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">Contact</th>
                  <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-6">
                      <p className="font-bold text-slate-900">{entry.product_name}</p>
                      <p className="text-xs text-slate-400 mt-1 uppercase tracking-tighter">ID: #{entry.id}</p>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg font-bold text-slate-900">₹{entry.price}</span>
                        <span className="text-slate-500 text-sm">/ {entry.unit}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Qty: {entry.quantity} {entry.unit}</p>
                    </td>
                    <td className="px-6 py-6">
                      <p className="font-medium text-slate-700">{entry.shop_name}</p>
                      <div className="flex items-center text-slate-400 text-sm mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {entry.shop_location}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex items-center text-slate-500 text-sm whitespace-nowrap">
                        <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                        {entry.bill_date ? new Date(entry.bill_date).toLocaleDateString(undefined, { 
                          year: 'numeric', month: 'short', day: 'numeric' 
                        }) : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {entry.mobile_number ? (
                        <div className="flex items-center text-slate-500 text-sm">
                          <Phone className="w-4 h-4 mr-2 text-slate-400" />
                          {entry.mobile_number}
                        </div>
                      ) : (
                        <span className="text-slate-300 italic text-sm">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-6 text-right">
                      {deleteConfirmId === entry.id ? (
                        <div className="flex items-center justify-end space-x-2 animate-in fade-in slide-in-from-right-1 duration-200">
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="text-xs font-bold text-slate-500 hover:text-slate-700 px-2 py-1"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                          >
                            Confirm
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(entry.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          title="Delete entry"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
            <LayoutList className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">No entries yet</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            You haven't added any grocery prices yet. Start by contributing a new price entry!
          </p>
          <button 
            onClick={() => window.location.href = '/add'}
            className="mt-8 inline-block bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
          >
            Add First Entry
          </button>
        </div>
      )}
    </div>
  );
}
