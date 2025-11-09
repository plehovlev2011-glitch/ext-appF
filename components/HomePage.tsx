import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import cardImage from 'figma:asset/eee1816b0bb3b9f86c18b7f2432198d54c0fadbb.png';
import barcodeImage from 'figma:asset/e986b7af0ff8ff67913a46909aee687d5c84284b.png';
import { LunchCardPage } from './LunchCardPage';
import { BackupPage } from './BackupPage';

interface HomePageProps {
  onStoriesOpen: (open: boolean) => void;
  onChatOpen: () => void;
}

interface UserProfile {
  name: string;
  hideNameInGreeting: boolean;
}

interface Promo {
  title: string;
  description: string;
  posCode: string;
  emoji: string;
  borderRadius: string;
}

export function HomePage({ onStoriesOpen, onChatOpen }: HomePageProps) {
  const [showAllConditions, setShowAllConditions] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [activePromo, setActivePromo] = useState<{ promo: Promo; code: string } | null>(null);
  const [showLunchCard, setShowLunchCard] = useState(false);
  const [showBackupPage, setShowBackupPage] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({ name: '', hideNameInGreeting: false });
  const cardImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const loadProfile = () => {
      const savedProfile = localStorage.getItem('perecUserProfile');
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setUserProfile({ 
            name: parsed.name || '', 
            hideNameInGreeting: parsed.hideNameInGreeting || false 
          });
        } catch (e) {
          console.error('Failed to parse user profile');
        }
      }
    };

    loadProfile();
    window.addEventListener('profileUpdated', loadProfile);
    return () => window.removeEventListener('profileUpdated', loadProfile);
  }, []);

  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeInMinutes = hour * 60 + minute;
    
    let greetingText = '';
    
    if (timeInMinutes >= 330 && timeInMinutes < 660) {
      greetingText = 'доброе утро';
    } else if (timeInMinutes >= 660 && timeInMinutes < 1020) {
      greetingText = 'добрый день';
    } else if (timeInMinutes >= 1020 && timeInMinutes < 1260) {
      greetingText = 'добрый вечер';
    } else {
      greetingText = 'доброй ночи';
    }

    if (userProfile.name && !userProfile.hideNameInGreeting) {
      return `${greetingText}, ${userProfile.name}!`;
    }
    
    return `${greetingText}👋`;
  };

  const generatePromoCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const promos: Promo[] = [
    {
      emoji: '🍛',
      title: 'восьмой обед в подарок',
      description: 'собирайте печати-перчики за каждую покупку от 250 рублей!',
      posCode: 'ВОСЬМ.ОБЕД ПОДАР.',
      borderRadius: '5px'
    },
    {
      emoji: '🥐',
      title: 'скидка 30% на выпечку',
      description: 'на всю выпечку с 16:30 до закрытия (17:00)',
      posCode: 'СКИДКА ВЫПЕЧ.30%',
      borderRadius: '50px'
    },
    {
      emoji: '📦',
      title: 'скидка 40% на вчерашнюю выпечку',
      description: 'специальная скидка на выпечку прошлого дня',
      posCode: 'ВЧЕРА ВЫПЕЧ.40%',
      borderRadius: '5px'
    }
  ];

  const handlePromoClick = (promo: Promo) => {
    const code = generatePromoCode();
    setActivePromo({ promo, code });
  };

  const scrollToCard = () => {
    cardImageRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <>
      {showLunchCard && <LunchCardPage onClose={() => setShowLunchCard(false)} />}
      {showBackupPage && <BackupPage onClose={() => setShowBackupPage(false)} />}
      
      <div className="min-h-screen bg-white pb-32">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="px-4 pt-4 pb-2"
          style={{ marginTop: '3rem' }}
        >
          <h1 className="text-black text-left" style={{ fontSize: '36px' }}>
            {getGreeting()}
          </h1>
        </motion.div>

        {/* Contact Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="px-4 mb-6"
        >
          <div className="bg-white border-2 border-red-600 p-5">
            <h3 className="text-black mb-2" style={{ fontSize: '16px' }}>предприятие на ул.горького 63к1, киров</h3>
            <p className="text-gray-600 mb-4" style={{ fontSize: '14px' }}>режим работы: пн-пт 9:00-17:00</p>
            <button
              onClick={() => setShowContactDialog(true)}
              className="w-full bg-white border-2 border-red-600 text-red-600 p-3 text-center transition-colors hover:bg-red-50"
              style={{ borderRadius: '9999px', fontSize: '14px' }}
            >
              связаться
            </button>
          </div>
        </motion.div>

        {/* Discount and Lunch Card Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="px-4 mb-6"
        >
          <div className="flex gap-3">
            <button
              onClick={scrollToCard}
              className="relative flex-1"
              style={{ height: '50px' }}
            >
              <svg className="absolute inset-0 w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 315 120">
                <ellipse cx="157.5" cy="60" fill="#FF0000" rx="157.5" ry="60" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white" style={{ fontSize: '12px' }}>дисконт</p>
              </div>
            </button>

            <button
              onClick={() => setShowLunchCard(true)}
              className="relative flex-1"
              style={{ height: '50px' }}
            >
              <svg className="absolute inset-0 w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 315 120">
                <ellipse cx="157.5" cy="60" fill="#FF0000" rx="157.5" ry="60" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-white" style={{ fontSize: '12px' }}>карта обедов</p>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Card Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <img 
            ref={cardImageRef}
            src={cardImage} 
            alt="Карта вам выгода" 
            className="w-full"
          />
        </motion.div>

        {/* Conditions Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="px-4 mb-4"
        >
          <div className="bg-red-600 text-white p-5" style={{ borderRadius: '5px' }}>
            <h3 className="mb-3" style={{ fontSize: '18px' }}>условия программы лояльности</h3>
            
            <div className="space-y-2 mb-3">
              <p style={{ fontSize: '14px' }}>• скидка 5% на весь ассортимент</p>
              <p style={{ fontSize: '14px' }}>• карта действует во всех наших заведениях</p>
            </div>

            <AnimatePresence>
              {showAllConditions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2 mb-3"
                >
                  <p style={{ fontSize: '14px' }}>• скидка не применяется на категории:</p>
                  <p style={{ fontSize: '13px', paddingLeft: '12px' }}>- НОВЫЕ АЛКОГОЛЬНЫЕ ТОВАРЫ</p>
                  <p style={{ fontSize: '13px', paddingLeft: '12px' }}>- Кофе заварной</p>
                  <p style={{ fontSize: '13px', paddingLeft: '12px' }}>- Десерты</p>
                  <p style={{ fontSize: '13px', paddingLeft: '12px' }}>- Напитки</p>
                  <p style={{ fontSize: '14px', marginTop: '8px' }}>• карта не передаётся третьим лицам</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={() => setShowAllConditions(!showAllConditions)}
              className="w-full bg-white text-red-600 p-3 text-center transition-colors hover:bg-gray-100"
              style={{ borderRadius: '100px', fontSize: '14px' }}
            >
              {showAllConditions ? 'скрыть' : 'показать всё'}
            </button>
          </div>
        </motion.div>

        {/* Promotional Offers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="px-4 mb-6"
        >
          <h3 className="text-black mb-3" style={{ fontSize: '18px' }}>только для вас</h3>
          <div className="space-y-3">
            <div className="bg-white border-2 border-red-600 p-4" style={{ borderRadius: '5px' }}>
              <h4 className="text-black mb-1" style={{ fontSize: '16px' }}>скидка 5%</h4>
              <p className="text-gray-600" style={{ fontSize: '14px' }}>на большую часть нашего ассортимента</p>
            </div>
            
            <div className="bg-white border-2 border-red-600 p-4" style={{ borderRadius: '50px' }}>
              <h4 className="text-black mb-1" style={{ fontSize: '16px' }}>быстрое обслуживание</h4>
              <p className="text-gray-600" style={{ fontSize: '14px' }}>предъявите карту и получите приоритет</p>
            </div>
          </div>
        </motion.div>

        {/* Promo Codes Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="px-4"
        >
          <h2 className="text-black mb-2" style={{ fontSize: '20px' }}>промокоды "вам выгода!"</h2>
          <p className="text-gray-600 mb-4" style={{ fontSize: '14px' }}>супервыгодные предложения, доступные эксклюзивно в приложении</p>
          
          <div className="space-y-4">
            {promos.map((promo, index) => (
              <motion.button
                key={index}
                onClick={() => handlePromoClick(promo)}
                className="w-full bg-white border-2 border-red-600 p-5 text-left transition-all hover:bg-red-50"
                style={{ borderRadius: promo.borderRadius }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start gap-3">
                  <span style={{ fontSize: '32px' }}>{promo.emoji}</span>
                  <div className="flex-1">
                    <h3 className="text-black mb-1" style={{ fontSize: '16px' }}>{promo.title}</h3>
                    <p className="text-gray-600" style={{ fontSize: '14px' }}>{promo.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Contact Dialog */}
        <AnimatePresence>
          {showContactDialog && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowContactDialog(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 max-w-sm w-full"
                style={{ borderRadius: '20px' }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-black text-center mb-6" style={{ fontSize: '20px' }}>
                  где хотите с нами связаться?
                </h2>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      window.location.href = 'tel:+79127037979';
                      setShowContactDialog(false);
                    }}
                    className="w-full bg-red-600 text-white p-4 text-center transition-colors hover:bg-red-700"
                    style={{ fontSize: '16px' }}
                  >
                    по телефону
                  </button>
                  
                  <button
                    onClick={() => {
                      onChatOpen();
                      setShowContactDialog(false);
                    }}
                    className="w-full bg-red-600 text-white p-4 text-center transition-colors hover:bg-red-700"
                    style={{ fontSize: '16px' }}
                  >
                    в чате
                  </button>
                  
                  <button
                    onClick={() => setShowContactDialog(false)}
                    className="w-full bg-white border-2 border-red-600 text-red-600 p-4 text-center transition-colors hover:bg-red-50"
                    style={{ borderRadius: '100px', fontSize: '16px' }}
                  >
                    закрыть
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Promo Code Dialog */}
        <AnimatePresence>
          {activePromo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              onClick={() => setActivePromo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white p-6 max-w-sm w-full"
                style={{ borderRadius: '20px' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <span style={{ fontSize: '48px' }}>{activePromo.promo.emoji}</span>
                  <h2 className="text-black mt-3 mb-2" style={{ fontSize: '20px' }}>
                    {activePromo.promo.title}
                  </h2>
                  <p className="text-gray-600" style={{ fontSize: '14px' }}>
                    {activePromo.promo.description}
                  </p>
                </div>

                <div className="bg-white border-2 border-red-600 p-4 mb-4" style={{ borderRadius: '10px' }}>
                  <img src={barcodeImage} alt="Баркод" className="w-full mb-3" />
                  <div className="text-center">
                    <p className="text-gray-600 mb-1" style={{ fontSize: '12px' }}>код для активации:</p>
                    <p className="text-black mb-3" style={{ fontSize: '20px', letterSpacing: '2px' }}>
                      {activePromo.code}
                    </p>
                    <div className="bg-red-600 text-white p-3" style={{ borderRadius: '5px' }}>
                      <p style={{ fontSize: '12px' }}>Д/POS:</p>
                      <p style={{ fontSize: '16px' }}>{activePromo.promo.posCode}</p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-center mb-4" style={{ fontSize: '12px' }}>
                  покажите данный код кассиру для получения скидки
                </p>

                <button
                  onClick={() => setActivePromo(null)}
                  className="w-full bg-white border-2 border-red-600 text-red-600 p-4 text-center transition-colors hover:bg-red-50"
                  style={{ borderRadius: '100px', fontSize: '16px' }}
                >
                  закрыть
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backup Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="px-4 mt-8"
        >
          <button
            onClick={() => setShowBackupPage(true)}
            className="relative w-full"
            style={{ height: '50px' }}
          >
            <svg className="absolute inset-0 w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 315 120">
              <ellipse cx="157.5" cy="60" fill="#FF0000" rx="157.5" ry="60" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white" style={{ fontSize: '14px' }}>мои резервные копии</p>
            </div>
          </button>
        </motion.div>
      </div>
    </>
  );
}