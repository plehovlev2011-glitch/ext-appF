import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Camera } from 'lucide-react';
import { NavigationBar } from './NavigationBar';
import { TopNavBar } from './TopNavBar';
import { HomePage } from './HomePage';
import { BonusesPage } from './BonusesPage';
import { DeliveryPage } from './DeliveryPage';
import { ChatPage } from './ChatPage';
import { EventsPage } from './EventsPage';
import { AccountPage } from './AccountPage';

interface UserProfile {
  photo: string | null;
}

export function MainApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [showChat, setShowChat] = useState(false);
  const [showStories, setShowStories] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({ photo: null });

  useEffect(() => {
    const savedProfile = localStorage.getItem('perecUserProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setUserProfile({ photo: parsed.photo || null });
      } catch (e) {
        console.error('Failed to parse user profile');
      }
    }

    // Listen for profile updates
    const handleStorageChange = () => {
      const savedProfile = localStorage.getItem('perecUserProfile');
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setUserProfile({ photo: parsed.photo || null });
        } catch (e) {
          console.error('Failed to parse user profile');
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen to a custom event for same-page updates
    window.addEventListener('profileUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleStorageChange);
    };
  }, [showAccount]); // Re-check when account page closes

  const renderContent = () => {
    if (showAccount) {
      return <AccountPage onClose={() => setShowAccount(false)} />;
    }
    
    if (showChat) {
      return <ChatPage onBack={() => setShowChat(false)} />;
    }

    switch (activeTab) {
      case 'home':
        return <HomePage onStoriesOpen={setShowStories} onChatOpen={() => setShowChat(true)} />; 
      case 'bonuses':
        return <DeliveryPage />; // доставка
      case 'delivery':
        return <EventsPage />; // торжества
      default:
        return <HomePage onStoriesOpen={setShowStories} onChatOpen={() => setShowChat(true)} />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1]
      }}
      className="min-h-screen bg-white"
    >
      {/* Fixed white top padding */}
      <div className="fixed top-0 left-0 right-0 h-12 bg-white z-40" />

      {/* Account Button/Photo - Top Left (after TopNavBar) */}
      {!showChat && !showAccount && (
        <motion.button
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onClick={() => setShowAccount(true)}
          className="fixed left-4 z-50"
          style={{
            top: '60px',
            filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.15))'
          }}
          whileTap={{ scale: 0.95 }}
        >
          {userProfile.photo ? (
            <div 
              className="w-12 h-12 bg-red-600 flex items-center justify-center overflow-hidden border-2 border-white"
              style={{ borderRadius: '50%' }}
            >
              <img 
                src={userProfile.photo} 
                alt="Профиль" 
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div style={{ width: '90px', height: '40px' }}>
              <svg 
                className="absolute inset-0 w-full h-full" 
                fill="none" 
                preserveAspectRatio="none" 
                viewBox="0 0 180 80"
              >
                <ellipse 
                  cx="90" 
                  cy="40" 
                  fill="#FF0000" 
                  rx="90" 
                  ry="40" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white" style={{ fontSize: '12px' }}>
                  мой профиль
                </p>
              </div>
            </div>
          )}
        </motion.button>
      )}

      {/* Top Navigation Bar */}
      {!showChat && (
        <TopNavBar 
          visible={true}
        />
      )}

      <motion.main 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.8, 
          delay: 0.1,
          ease: [0.16, 1, 0.3, 1]
        }}
        className="w-full pt-12"
      >
        {renderContent()}
      </motion.main>
      
      {/* Bottom shadow */}
      <div 
        className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none z-30"
        style={{
          background: 'linear-gradient(to top, rgba(0, 0, 0, 0.08), transparent)'
        }}
      />

      {/* Navigation Bar - always visible unless stories are open */}
      {!showChat && !showStories && !showAccount && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 1.0,
            delay: 0.4,
            ease: [0.16, 1, 0.3, 1],
            type: "spring",
            damping: 25,
            stiffness: 200
          }}
        >
          <NavigationBar 
            activeTab={activeTab} 
            onTabChange={setActiveTab}
          />
        </motion.div>
      )}
    </motion.div>
  );
}