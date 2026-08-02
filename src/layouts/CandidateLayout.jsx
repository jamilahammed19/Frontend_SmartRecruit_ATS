import { Outlet } from 'react-router-dom';
import CandidateNavbar from '../components/layout/CandidateNavbar';
import Footer from '../components/layout/Footer';

export default function CandidateLayout() {
    return (
        <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
            {/* The Top Navigation Bar */}
            <CandidateNavbar />
            
            {/* The Main Content Area (flex-grow pushes the footer to the bottom) */}
            <main className="flex-grow">
                <Outlet />
            </main>

            {/* The Bottom Footer */}
            <Footer />
        </div>
    );
}