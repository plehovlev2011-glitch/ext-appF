import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoadingScreenProps {
  onComplete: () => void;
}

interface UserProfile {
  name: string;
  photo: string | null;
  hideNameInGreeting: boolean;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [stage, setStage] = useState<'logo' | 'background' | 'greeting' | 'exit'>('logo');
  const [userProfile, setUserProfile] = useState<UserProfile>({ 
    name: '', 
    photo: null,
    hideNameInGreeting: false 
  });

  useEffect(() => {
    const savedProfile = localStorage.getItem('perecUserProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setUserProfile({ 
          name: parsed.name || '', 
          photo: parsed.photo || null,
          hideNameInGreeting: parsed.hideNameInGreeting || false
        });
      } catch (e) {
        console.error('Failed to parse user profile');
      }
    }
  }, []);
  
  const getGreeting = () => {
    const now = new Date();
    const hour = now.getHours();
    
    let greetingText = '';
    
    if (hour >= 5 && hour < 11) greetingText = 'доброе утро!';
    else if (hour >= 11 && hour < 17) greetingText = 'добрый день!';
    else if (hour >= 17 && hour < 22) greetingText = 'добрый вечер!';
    else greetingText = 'доброй ночи!';

    if (userProfile.name && !userProfile.hideNameInGreeting) {
      return `${greetingText.replace('!', '')}, ${userProfile.name}!`;
    }
    
    return greetingText;
  };

  useEffect(() => {
    const logoTimer = setTimeout(() => setStage('background'), 2500);
    const greetingTimer = setTimeout(() => setStage('greeting'), 2700);
    const exitTimer = setTimeout(() => setStage('exit'), 4500);
    const completeTimer = setTimeout(() => onComplete(), 5300);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(greetingTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Вертикальные сплющенные овалы во весь экран
  const ovals = [0, 1, 2, 3, 4].map((i) => ({
    id: i,
    width: 100, // % от экрана
    height: 60, // сильно сплющенный овал
    left: i * 20 - 10, // расположение в ряд с перекрытием
    delay: i * 0.2
  }));

  return (
    <motion.div 
      className="fixed inset-0 z-50 overflow-hidden"
      animate={stage === 'exit' ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Стадия логотипа на белом фоне */}
      <AnimatePresence>
        {stage === 'logo' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute inset-0 bg-white flex items-center justify-center"
          >
            <div className="text-red-600 text-4xl font-bold">перец</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Красный фон с овалами */}
      <AnimatePresence>
        {(stage === 'background' || stage === 'greeting' || stage === 'exit') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-red-600 overflow-hidden"
          >
            {/* Ряд вертикальных сплющенных овалов */}
            {ovals.map((oval) => (
              <motion.div
                key={oval.id}
                className="absolute bg-white bg-opacity-15"
                style={{
                  width: `${oval.width}%`,
                  height: `${oval.height}%`,
                  left: `${oval.left}%`,
                  top: '20%',
                  borderRadius: '50% / 40%' // сплющенный овал
                }}
                animate={{
                  scale: [1, 1.3, 0.7, 1],
                  opacity: [0.1, 0.2, 0.05, 0.1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: "easeInOut",
                  delay: oval.delay,
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Приветствие */}
      <AnimatePresence>
        {stage === 'greeting' && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="absolute inset-0 flex flex-col items-center justify-center z-10 gap-4"
          >
            {/* Фото профиля */}
            {userProfile.photo && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-24 h-24 bg-white flex items-center justify-center overflow-hidden border-4 border-white shadow-lg"
                style={{ borderRadius: '50%' }}
              >
                <img 
                  src={userProfile.photo} 
                  alt="Профиль" 
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            {/* Текст приветствия */}
            <div 
              className="bg-white px-8 py-4 border-2 border-white backdrop-blur-sm"
              style={{ borderRadius: '200px' }}
            >
              <p className="text-black text-xl">{getGreeting()}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}