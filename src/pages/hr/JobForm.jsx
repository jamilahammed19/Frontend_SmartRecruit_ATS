import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { getJob, createJob, updateJob } from '../../services/jobService';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function JobForm() {
    const { id } = useParams(); // If there is an ID, we are in Edit Mode
    const navigate = useNavigate();
    const isEditMode = !!id;

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        department: '',
        description: '',
        requirements: '',
        deadline: '',
        status: 'open',
    });

    const [loading, setLoading] = useState(isEditMode);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            fetchJob();
        }
    }, [id]);

    const fetchJob = async () => {
        try {
            const data = await getJob(id);
            setFormData({
                title: data.title || '',
                location: data.location || '',
                department: data.department || '',
                description: data.description || '',
                requirements: data.requirements || '',
                deadline: data.deadline || '',
                status: data.status || 'open',
            });
        } catch (err) {
            setError('Failed to fetch job details.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            if (isEditMode) {
                await updateJob(id, formData);
            } else {
                await createJob(formData);
            }
            navigate('/hr/jobs');
        } catch (err) {
            setError(err.response?.data?.detail || 'An error occurred while saving the job.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 text-slate-500">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center space-x-4">
                <Link to="/hr/jobs" className="text-slate-400 hover:text-slate-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">
                    {isEditMode ? 'Edit Job Posting' : 'Create New Job'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 border border-slate-200 rounded-xl shadow-sm space-y-6">
                {error && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Job Title" name="title" value={formData.title} onChange={handleChange} required />
                    <Input label="Department" name="department" value={formData.department} onChange={handleChange} required />
                    <Input label="Location" name="location" value={formData.location} onChange={handleChange} required />
                    <Input label="Application Deadline" type="date" name="deadline" value={formData.deadline} onChange={handleChange} required />
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">Status</label>
                    <select 
                        name="status" 
                        value={formData.status} 
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        <option value="open">Open (Visible to candidates)</option>
                        <option value="processing">In Processing Stage</option>
                        <option value="completed">Completed / Closed</option>
                    </select>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">Job Description</label>
                    <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleChange} 
                        rows="5"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        placeholder="Detailed description of the role..."
                    ></textarea>
                </div>

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-slate-700">Requirements</label>
                    <textarea 
                        name="requirements" 
                        value={formData.requirements} 
                        onChange={handleChange} 
                        rows="5"
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
                        placeholder="List skills, experience, and qualifications needed..."
                    ></textarea>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
                    <Link to="/hr/jobs" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                        Cancel
                    </Link>
                    <Button type="submit" isLoading={saving}>
                        {isEditMode ? 'Save Changes' : 'Publish Job'}
                    </Button>
                </div>
            </form>
        </div>
    );
}