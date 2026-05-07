import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Package, Tag, Scale, Store, MapPin, Phone, CircleCheck, CircleAlert, CirclePlus, Calendar } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export default function AddProductPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    product_name: '',
    price: '',
    quantity: '',
    unit: 'kg',
    shop_name: '',
    shop_location: '',
    mobile_number: '',
    bill_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validation
    if (parseFloat(formData.price) <= 0 || parseFloat(formData.quantity) <= 0) {
      setError('Price and Quantity must be greater than 0.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/products/`, {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseFloat(formData.quantity)
      });
      setSuccess(true);
      setTimeout(() => navigate(`/?search=${encodeURIComponent(formData.product_name)}`), 2000);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === 'string' ? detail : JSON.stringify(detail) || 'Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 animate-fade-in pb-20">
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="bg-primary-600 px-8 py-10 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2 text-white">Contribute Price</h1>
            <p className="text-primary-100">Help the community by sharing local shop prices.</p>
          </div>
          <div className="absolute -top-6 -right-6 p-8 opacity-10 rotate-12">
            <CirclePlus size={160} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center space-x-2">
              <CircleAlert className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center space-x-2">
              <CircleCheck className="w-5 h-5 flex-shrink-0" />
              <span>Entry added successfully! Redirecting...</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <Package className="w-4 h-4 mr-2 text-primary-500" /> Product Name
              </label>
              <input
                required
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                placeholder="e.g. Sona Masuri Rice"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <Tag className="w-4 h-4 mr-2 text-primary-500" /> Price (₹)
              </label>
              <input
                required
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <Scale className="w-4 h-4 mr-2 text-primary-500" /> Quantity
              </label>
              <div className="flex space-x-2">
                <input
                  required
                  type="number"
                  step="0.1"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="1.0"
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
                />
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-24 px-2 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none bg-white font-medium"
                >
                  <option value="kg">kg</option>
                  <option value="liter">liter</option>
                  <option value="piece">piece</option>
                  <option value="packet">packet</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <Store className="w-4 h-4 mr-2 text-primary-500" /> Shop Name
              </label>
              <input
                required
                name="shop_name"
                value={formData.shop_name}
                onChange={handleChange}
                placeholder="e.g. Reliance Fresh"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-primary-500" /> Shop Location
              </label>
              <input
                required
                name="shop_location"
                value={formData.shop_location}
                onChange={handleChange}
                placeholder="Full address or area name"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
              />
            </div>

            <div className="md:col-span-1 space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-primary-500" /> Bill Date
              </label>
              <input
                required
                type="date"
                name="bill_date"
                value={formData.bill_date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center">
                <Phone className="w-4 h-4 mr-2 text-primary-500" /> Mobile Number (Optional)
              </label>
              <input
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-primary-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Add Price Entry'}
          </button>
        </form>
      </div>
    </div>
  );
}
