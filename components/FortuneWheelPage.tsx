import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone } from 'lucide-react';

interface FortuneWheelPageProps {
  onClose: () => void;
}

export function FortuneWheelPage({ onClose }: FortuneWheelPageProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [lastSpinDate, setLastSpinDate] = useState<string | null>(null);
  const [canSpin, setCanSpin] = useState(true);
  const [shakeDetected, setShakeDetected] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const lastShakeTime = useRef(0);
  const shakeThreshold = 15;

  useEffect(() => {
    const saved = localStorage.getItem('perecLastSpinDate');
    if (saved) {
      setLastSpinDate(saved);
      const today = new Date().toDateString();
      setCanSpin(saved !== today);
    }
  }, []);

  useEffect(() => {
    // Check if device supports DeviceMotionEvent
    if (typeof DeviceMotionEvent === 'undefined') {
      return;
    }

    let lastX = 0;
    let lastY = 0;
    let lastZ = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      if (isSpinning || !canSpin) return;

      const acceleration = event.accelerationIncludingGravity;
      if (!acceleration) return;

      const x = acceleration.x || 0;
      const y = acceleration.y || 0;
      const z = acceleration.z || 0;

      const deltaX = Math.abs(x - lastX);
      const deltaY = Math.abs(y - lastY);
      const deltaZ = Math.abs(z - lastZ);

      const totalDelta = deltaX + deltaY + deltaZ;

      // Visual feedback for shake intensity
      if (totalDelta > 5) {
        setShakeIntensity(Math.min(totalDelta / shakeThreshold, 1));
      } else {
        setShakeIntensity(0);
      }

      // Detect shake
      if (totalDelta > shakeThreshold) {
        const now = Date.now();
        if (now - lastShakeTime.current > 1000) { // Prevent multiple triggers
          lastShakeTime.current = now;
          setShakeDetected(true);
          
          // Vibrate if supported
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
          
          handleSpin();
          setTimeout(() => {
            setShakeDetected(false);
            setShakeIntensity(0);
          }, 1000);
        }
      }

      lastX = x;
      lastY = y;
      lastZ = z;
    };

    // Request permission for iOS 13+
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      (DeviceMotionEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleMotion as any);
          }
        })
        .catch(console.error);
    } else {
      // Non-iOS or older iOS
      window.addEventListener('devicemotion', handleMotion as any);
    }

    return () => {
      window.removeEventListener('devicemotion', handleMotion as any);
    };
  }, [isSpinning, canSpin]);

  const handleSpin = () => {
    if (!canSpin || isSpinning) return;

    setIsSpinning(true);
    
    // Spin for 5 seconds, always land on "проигрыш"
    const loseAngles = [45, 135, 225, 315];
    const targetAngle = loseAngles[Math.floor(Math.random() * loseAngles.length)];
    const spins = 5 + Math.random() * 3;
    const finalRotation = spins * 360 + targetAngle;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setShowResult(true);
      
      const today = new Date().toDateString();
      localStorage.setItem('perecLastSpinDate', today);
      setLastSpinDate(today);
      setCanSpin(false);
    }, 5000);
  };

  const handleResultClose = () => {
    setShowResult(false);
    onClose();
  };

  const requestMotionPermission = async () => {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permissionState = await (DeviceMotionEvent as any).requestPermission();
        if (permissionState === 'granted') {
          alert('Датчик движения активирован! Теперь можете трясти телефон для запуска колеса.');
        }
      } catch (error) {
        console.error('Motion permission denied');
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-[60] overflow-y-auto"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,200,200,0.3) 50%, rgba(255,255,255,0.95) 100%)'
      }}
    >
      <div className="min-h-screen pb-8 pt-12">
        {/* Header */}
        <div className="sticky top-12 bg-white bg-opacity-95 backdrop-blur-sm z-10 px-4 pt-4 pb-3 flex items-center justify-between border-b-2 border-red-600">
          <h1 className="text-black" style={{ fontSize: '24px' }}>колесо фортуны</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 transition-colors"
            style={{ borderRadius: '50%' }}
          >
            <X className="w-6 h-6 text-red-600" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 mt-8 flex flex-col items-center">
          {/* Prize Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-red-600 text-white p-6 mb-8 w-full max-w-md text-center"
            style={{ borderRadius: '20px' }}
          >
            <h2 className="mb-2" style={{ fontSize: '20px' }}>приз</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
              бесплатный обед на сумму до 250 рублей!
            </p>
          </motion.div>

          {/* Shake Indicator */}
          {canSpin && !isSpinning && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 w-full max-w-md"
            >
              <div className="bg-white border-2 border-red-600 p-5 text-center" style={{ borderRadius: '20px' }}>
                <motion.div
                  animate={shakeDetected ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center gap-3 mb-3"
                >
                  <Smartphone className="w-8 h-8 text-red-600" />
                  <p className="text-black" style={{ fontSize: '18px' }}>
                    {shakeDetected ? 'запуск!' : 'потрясите телефон'}
                  </p>
                </motion.div>
                
                {/* Shake intensity bar */}
                <div className="w-full bg-gray-200 h-2 overflow-hidden" style={{ borderRadius: '10px' }}>
                  <motion.div
                    className="h-full bg-red-600"
                    style={{ 
                      width: `${shakeIntensity * 100}%`,
                      transition: 'width 0.1s ease-out'
                    }}
                  />
                </div>
                <p className="text-gray-600 mt-2" style={{ fontSize: '12px' }}>
                  {shakeIntensity > 0.7 ? 'ещё немного!' : 'трясите сильнее'}
                </p>
              </div>
              
              {/* iOS Permission Button */}
              {typeof (DeviceMotionEvent as any).requestPermission === 'function' && (
                <button
                  onClick={requestMotionPermission}
                  className="w-full mt-3 bg-gray-200 text-gray-700 p-3 hover:bg-gray-300 transition-colors"
                  style={{ borderRadius: '15px', fontSize: '14px' }}
                >
                  разрешить датчик движения
                </button>
              )}
            </motion.div>
          )}

          {/* Wheel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: shakeDetected ? 1.05 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="relative mb-8"
            style={{ 
              width: '300px', 
              height: '300px',
              filter: shakeDetected ? 'drop-shadow(0 0 20px rgba(255,0,0,0.5))' : 'none'
            }}
          >
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
              <div 
                className="w-0 h-0" 
                style={{
                  borderLeft: '15px solid transparent',
                  borderRight: '15px solid transparent',
                  borderTop: '25px solid #FF0000'
                }}
              />
            </div>

            {/* Wheel SVG */}
            <motion.svg
              viewBox="0 0 200 200"
              className="w-full h-full"
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
              }}
            >
              {/* 8 sections alternating win/lose */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const angle = i * 45;
                const isWin = i % 2 === 0;
                const rad1 = (angle * Math.PI) / 180;
                const rad2 = ((angle + 45) * Math.PI) / 180;
                
                const x1 = 100 + 90 * Math.cos(rad1 - Math.PI / 2);
                const y1 = 100 + 90 * Math.sin(rad1 - Math.PI / 2);
                const x2 = 100 + 90 * Math.cos(rad2 - Math.PI / 2);
                const y2 = 100 + 90 * Math.sin(rad2 - Math.PI / 2);

                return (
                  <g key={i}>
                    <path
                      d={`M 100 100 L ${x1} ${y1} A 90 90 0 0 1 ${x2} ${y2} Z`}
                      fill={isWin ? '#FF0000' : '#FFFFFF'}
                      stroke="#000000"
                      strokeWidth="2"
                    />
                    <text
                      x="100"
                      y="45"
                      transform={`rotate(${angle + 22.5} 100 100)`}
                      textAnchor="middle"
                      fill={isWin ? '#FFFFFF' : '#000000'}
                      fontSize="12"
                      fontWeight="bold"
                    >
                      {isWin ? 'ВЫИГРЫШ' : 'ПРОИГРЫШ'}
                    </text>
                  </g>
                );
              })}
              
              {/* Center circle */}
              <circle cx="100" cy="100" r="20" fill="#FF0000" stroke="#000000" strokeWidth="2" />
            </motion.svg>
          </motion.div>

          {/* Manual Spin Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={handleSpin}
            disabled={!canSpin || isSpinning}
            className={`px-8 py-4 text-white transition-all ${
              !canSpin || isSpinning 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 hover:scale-105'
            }`}
            style={{ 
              borderRadius: '50px',
              fontSize: '18px'
            }}
          >
            {isSpinning ? 'крутится...' : canSpin ? 'запустить' : 'использовано сегодня'}
          </motion.button>

          {/* Rules */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 bg-white p-5 w-full max-w-md"
            style={{ borderRadius: '20px', border: '2px solid rgba(0,0,0,0.1)' }}
          >
            <h3 className="text-black mb-3" style={{ fontSize: '18px' }}>правила</h3>
            <ul className="text-gray-600 space-y-2" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <li>• одна попытка в день</li>
              <li>• выигрыш действует 24 часа</li>
              <li>• приз - обед до 250₽</li>
              <li>• предъявите выигрыш на кассе</li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Result Dialog */}
      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 z-[70] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 200 }}
              className="bg-white p-8 max-w-md w-full text-center"
              style={{ borderRadius: '30px' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <p className="text-6xl mb-4">😢</p>
              </motion.div>
              
              <h2 className="text-black mb-3" style={{ fontSize: '24px' }}>
                не повезло
              </h2>
              <p className="text-gray-600 mb-6" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                попробуйте завтра! удача обязательно улыбнется вам
              </p>
              
              <button
                onClick={handleResultClose}
                className="w-full bg-red-600 text-white p-4 hover:bg-red-700 transition-colors"
                style={{ borderRadius: '50px', fontSize: '16px' }}
              >
                понятно
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
