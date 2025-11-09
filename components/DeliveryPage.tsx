import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Info } from 'lucide-react';
import { LocationSelectPage } from './LocationSelectPage';

export function DeliveryPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(false);
  const [timeUntilDelivery, setTimeUntilDelivery] = useState('');
  const [showLocationSelect, setShowLocationSelect] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const hour = now.getHours();
      const minute = now.getMinutes();
      const timeInMinutes = hour * 60 + minute;
      const dayOfWeek = now.getDay();
      
      // доставка доступна с понедельника по пятницу (1-5) с 9:00 до 13:00 (540-780 минут)
      const isWorkday = dayOfWeek >= 1 && dayOfWeek <= 5;
      const isWorkingHours = timeInMinutes >= 540 && timeInMinutes <= 780;
      
      setIsDeliveryAvailable(isWorkday && isWorkingHours);

      // расчет времени до следующей доставки
      if (!isWorkday) {
        const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
        setTimeUntilDelivery(`${daysUntilMonday} дн`);
      } else if (!isWorkingHours) {
        if (timeInMinutes < 540) {
          const hoursLeft = 8 - hour;
          const minutesLeft = 60 - minute;
          setTimeUntilDelivery(`${hoursLeft}ч ${minutesLeft}м`);
        } else {
          setTimeUntilDelivery('завтра');
        }
      } else {
        const hoursLeft = 12 - hour;
        const minutesLeft = 60 - minute;
        setTimeUntilDelivery(`${hoursLeft}ч ${minutesLeft}м`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);

    return () => clearInterval(interval);
  }, []);

  const deliveryServices = [
    {
      name: 'яндекс go',
      url: 'https://clck.ru/3NrcZR',
    },
    {
      name: 'чиббис',
      url: 'https://clck.ru/3Nrcdg',
    }
  ];

  const getDayStatus = () => {
    const dayOfWeek = currentTime.getDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) return 'рабочий день';
    return 'выходной';
  };

  return (
    <>
      <div className="min-h-screen bg-white px-4 sm:px-6 pt-4 pb-32">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <div className="text-center mb-4">
          <h1 className="text-3xl text-black">доставим</h1>
        </div>
      </motion.div>

      {/* main status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-6"
      >
        <div className={`p-5 ${
          isDeliveryAvailable 
            ? 'bg-white border-2 border-red-600' 
            : 'bg-gray-100'
        }`}
        style={{ borderRadius: isDeliveryAvailable ? '5px' : '50px' }}>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg text-black">
                {isDeliveryAvailable ? 'доставка доступна' : 'доставка недоступна'}
              </span>
            </div>
            <div className="text-right">
              <div className="text-xl text-black">{timeUntilDelivery}</div>
              <div className="text-sm text-gray-600">
                {isDeliveryAvailable ? 'до конца смены' : 'до открытия'}
              </div>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 leading-relaxed">
            {isDeliveryAvailable 
              ? 'можете заказать доставку в сервисах "чиббис" и "яндекс go"'
              : 'доставку можно заказать только в рабочие дни заведения'
            }
          </p>
        </div>
      </motion.div>

      {/* schedule ovals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex gap-4">
          {/* time oval */}
          <div 
            className="bg-red-600 text-white p-6 text-center flex-1"
            style={{ 
              borderRadius: '200px / 80px',
              aspectRatio: '2.5 / 1'
            }}
          >
            <div className="text-sm mb-1">время</div>
            <div className="text-xl">9:00-13:00</div>
          </div>

          {/* days oval */}
          <div 
            className="bg-red-600 text-white p-6 text-center flex-1"
            style={{ 
              borderRadius: '200px / 80px',
              aspectRatio: '2.5 / 1'
            }}
          >
            <div className="text-sm mb-1">дни</div>
            <div className="text-xl">пн-пт</div>
          </div>
        </div>
      </motion.div>

      {/* Location/Enterprise Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="mb-6"
      >
        <div className="bg-white border-2 border-red-600 p-5" style={{ borderRadius: '20px' }}>
          <h3 className="text-lg text-black mb-3">предприятие</h3>
          <p className="text-gray-600 mb-3" style={{ fontSize: '14px' }}>горького 63к1, киров</p>
          <button
            onClick={() => setShowLocationSelect(true)}
            className="w-full bg-gray-100 text-black p-3 transition-colors hover:bg-gray-200"
            style={{ borderRadius: '50px', fontSize: '14px' }}
          >
            выбрать другое
          </button>
        </div>
      </motion.div>

      {/* delivery services */}
      {isDeliveryAvailable && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-lg text-black mb-3">выберите сервис</h3>
          <div className="space-y-3">
            {deliveryServices.map((service, index) => (
              <a
                key={index}
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-red-600 hover:bg-red-700 text-white p-5 transition-colors duration-200 text-center"
                style={{ 
                  borderRadius: '100px',
                  fontSize: '16px'
                }}
              >
                {service.name}
              </a>
            ))}
          </div>
        </motion.div>
      )}

      {/* information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="bg-white border border-gray-300 p-5"
          style={{ borderRadius: '5px' }}>
          
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-5 h-5 text-red-600" />
            <h3 className="text-lg text-black">важная информация</h3>
          </div>
          
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• доставка осуществляется только с понедельника по пятницу</li>
            <li>• минимальная сумма заказа может отличаться</li>
            <li>• время доставки зависит от загруженности</li>
            <li>• оплата через приложение доставки</li>
          </ul>
        </div>
      </motion.div>

      {/* current time */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center mt-6"
      >
        <p className="text-gray-500 text-sm">
          текущее время: {currentTime.toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </motion.div>
      </div>

      {/* Location Select Page */}
      <AnimatePresence>
        {showLocationSelect && (
          <LocationSelectPage onClose={() => setShowLocationSelect(false)} />
        )}
      </AnimatePresence>
    </>
  );
}