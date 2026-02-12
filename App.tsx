
import React, { useState, useEffect } from 'react';
import { Tab } from './types';
import Navigation from './components/Navigation';
import HomeView from './components/HomeView';
import GuideView from './components/GuideView';
import LocalView from './components/LocalView';
import StoreView from './components/StoreView';
import AssistantView from './components/AssistantView';
import CheckInForm from './components/CheckInForm';
import { Sun, Moon, Loader2 } from 'lucide-react';
import logo from './assets/logo.png';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.HOME);
  const [isDark, setIsDark] = useState(true);
  const [isCheckingReservation, setIsCheckingReservation] = useState(true);
  const [showCheckInForm, setShowCheckInForm] = useState(false);
  const [reservationData, setReservationData] = useState<{
    reservationId: string;
    guestName: string;
  } | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    // Check for reservation ID in URL params
    const params = new URLSearchParams(window.location.search);
    const reservationId = params.get('reservation');

    if (!reservationId) {
      // No reservation ID, allow access (for testing/development)
      setIsCheckingReservation(false);
      return;
    }

    // Check if form already completed in localStorage
    const completedKey = `checkin_completed_${reservationId}`;
    if (localStorage.getItem(completedKey) === 'true') {
      setIsCheckingReservation(false);
      return;
    }

    // Fetch reservation details from Guesty
    fetch(`/.netlify/functions/get-reservation?reservationId=${reservationId}`)
      .then(res => {
        // Check if response is JSON
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          // Not JSON, likely 404 - use mock data for local development
          console.warn('Netlify Functions not available, using mock data for development');
          return {
            reservationId: reservationId,
            guestName: 'Test Guest',
            formCompleted: false
          };
        }
        return res.json();
      })
      .then(data => {
        if (data.formCompleted) {
          // Form already completed in Guesty
          localStorage.setItem(completedKey, 'true');
          setIsCheckingReservation(false);
        } else {
          // Show check-in form
          setReservationData({
            reservationId: data.reservationId,
            guestName: data.guestName
          });
          setShowCheckInForm(true);
          setIsCheckingReservation(false);
        }
      })
      .catch(error => {
        console.error('Error fetching reservation:', error);
        // On error, use mock data for local development
        setReservationData({
          reservationId: reservationId,
          guestName: 'Test Guest'
        });
        setShowCheckInForm(true);
        setIsCheckingReservation(false);
      });
  }, []);

  const handleCheckInSuccess = () => {
    if (reservationData) {
      const completedKey = `checkin_completed_${reservationData.reservationId}`;
      localStorage.setItem(completedKey, 'true');
    }
    setShowCheckInForm(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case Tab.HOME:
        return <HomeView />;
      case Tab.GUIDE:
        return <GuideView />;
      case Tab.LOCAL:
        return <LocalView />;
      case Tab.STORE:
        return <StoreView />;
      case Tab.ASSISTANT:
        return <AssistantView />;
      default:
        return <HomeView />;
    }
  };

  // Show loading state while checking reservation
  if (isCheckingReservation) {
    return (
      <div className="min-h-screen max-w-md mx-auto flex items-center justify-center bg-luxury-light dark:bg-luxury-black">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-earth mx-auto mb-4" />
          <p className="text-luxury-black dark:text-luxury-light">Loading...</p>
        </div>
      </div>
    );
  }

  // Show check-in form if required
  if (showCheckInForm && reservationData) {
    return (
      <CheckInForm
        reservationId={reservationData.reservationId}
        guestName={reservationData.guestName}
        onSuccess={handleCheckInSuccess}
      />
    );
  }

  // Show normal guest manual
  return (
    <div className="min-h-screen max-w-md mx-auto relative flex flex-col bg-luxury-light dark:bg-luxury-black font-sans selection:bg-earth selection:text-white transition-colors duration-300">
      {/* Branding Header */}
      <header className="px-6 py-6 sticky top-0 bg-luxury-light/90 dark:bg-luxury-black/90 backdrop-blur-md z-40 border-b border-earth/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          <div className="flex flex-col">
            <span className="font-serif text-xl tracking-widest text-luxury-black dark:text-luxury-light uppercase">
              Empires <span className="text-earth italic font-normal">Property</span>
            </span>
            <span className="text-[10px] tracking-[0.3em] text-earth uppercase font-bold opacity-80">
              Luxury Serviced Stays
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full border border-earth/20 text-earth hover:bg-earth/10 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 pt-6 overflow-y-auto no-scrollbar">
        {renderContent()}
      </main>

      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default App;
