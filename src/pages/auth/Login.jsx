import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginUser } from '../../services/authService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await loginUser(formData);
            // Django Simple JWT returns { access, refresh }
            login(data.access, data.refresh);
        } catch (err) {
            setError(err.response?.data?.detail || 'Invalid credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
            
            {/* --- BACK TO HOME BUTTON --- */}
            <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
                <Link to="/" className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Home
                </Link>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900">Sign in to your account</h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-slate-200">
                    {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <Input label="Username" name="username" value={formData.username} onChange={handleChange} required />
                        <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
                        <Button type="submit" isLoading={loading}>Sign in</Button>
                    </form>
                    <div className="mt-6 text-center text-sm">
                        Need an account? <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">Register as Candidate</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}