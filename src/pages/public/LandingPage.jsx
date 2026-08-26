import PublicNavbar from '../../components/public/PublicNavbar';
import HeroSection from '../../components/public/HeroSection';
import FeaturesSection from '../../components/public/FeaturesSection';
import PublicFooter from '../../components/public/PublicFooter';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            <PublicNavbar />
            
            <main className="flex-grow">
                <HeroSection />
                <FeaturesSection />
            </main>

            <PublicFooter />
        </div>
    );
}