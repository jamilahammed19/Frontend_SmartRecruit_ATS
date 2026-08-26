import { Link } from 'react-router-dom';

export default function HeroSection() {
    return (
        <div className="relative overflow-hidden bg-slate-900">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-900 opacity-90"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
                <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-semibold tracking-wide border border-blue-400/30 mb-6">
                    Join Our Team
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6 max-w-4xl leading-tight">
                    Build your career with us. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Do work that matters.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl leading-relaxed">
                    We are always looking for innovative, driven individuals to join our mission. Create your candidate profile today to easily apply for our open roles and track your application status.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link to="/register" className="px-8 py-4 text-base font-bold text-slate-900 bg-white rounded-xl hover:bg-slate-100 transition-all shadow-lg hover:-translate-y-0.5">
                        Start Your Application
                    </Link>
                </div>
            </div>
        </div>
    );
}