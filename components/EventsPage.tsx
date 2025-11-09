import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import banquetImage1 from 'figma:asset/f7d3fb1e287c1d0c2f97fe302da46ec5aabc9145.png';
import banquetImage2 from 'figma:asset/c5f0792102bfb51efea3fe5f7e8b63e777ef54de.png';
import { PhotoViewer } from './PhotoViewer';
import { DevMenuPage } from './DevMenuPage';
import { X } from 'lucide-react';

export function EventsPage() {
  const [showPhone, setShowPhone] = useState(false);
  const [viewingPhoto, setViewingPhoto] = useState<string | null>(null);
  const [showAudioDialog, setShowAudioDialog] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [devCode, setDevCode] = useState('');
  const [showDevMenu, setShowDevMenu] = useState(false);

  const features = [
    {
      title: 'индивидуальный подход',
      description: 'персонализированное меню для каждого мероприятия',
    },
    {
      title: 'гибкий график',
      description: 'проводим мероприятия в удобное для вас время',
    },
    {
      title: 'торт в подарок',
      description: 'ручной работы при заказе банкета',
    },
    {
      title: 'premium сервис',
      description: 'профессиональное обслуживание и декор',
    }
  ];

  const advantages = [
    'уютная атмосфера и стильный интерьер',
    'авторская кухня от наших шеф-поваров',
    'индивидуальное оформление зала',
    'фотозона и декоративные элементы',
    'гибкие условия бронирования'
  ];

  const handleCodeSubmit = () => {
    if (devCode === '3007201152') {
      setShowCodeDialog(false);
      setShowAudioDialog(false);
      setShowDevMenu(true);
      setDevCode('');
    } else {
      setShowCodeDialog(false);
      setShowAudioDialog(false);
      setDevCode('');
    }
  };

  if (showDevMenu) {
    return <DevMenuPage onClose={() => setShowDevMenu(false)} />;
  }

  return (
    <>
      <div className="min-h-screen bg-white px-4 sm:px-6 pt-4 pb-32">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="text-center mb-4">
            <h1 className="text-black" style={{ fontSize: '28px' }}>                              банкеты в перце</h1>
            <p className="text-gray-600" style={{ fontSize: '16px' }}>создайте незабываемый праздник</p>
          </div>
        </motion.div>

        {/* Banquet Hall Photos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 space-y-4"
        >
          <button
            onClick={() => setViewingPhoto(banquetImage1)}
            className="overflow-hidden w-full block"
            style={{ borderRadius: '50px' }}
          >
            <img 
              src={banquetImage1}
              alt="Банкетный зал 1"
              className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </button>
          <button
            onClick={() => setViewingPhoto(banquetImage2)}
            className="overflow-hidden w-full block"
            style={{ borderRadius: '5px' }}
          >
            <img 
              src={banquetImage2}
              alt="Банкетный зал 2"
              className="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </button>
        </motion.div>

        {/* View All Photos Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-6"
        >
          <a
            href="https://photosperets19048.tilda.ws"
            target="_blank"
            rel="noopener noreferrer"
            className="relative block w-full"
            style={{ height: '50px' }}
          >
            <svg 
              className="absolute inset-0 w-full h-full" 
              fill="none" 
              preserveAspectRatio="none" 
              viewBox="0 0 315 120"
            >
              <ellipse 
                cx="157.5" 
                cy="60" 
                fill="#FF0000" 
                rx="157.5" 
                ry="60" 
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-white" style={{ fontSize: '14px' }}>
                смотреть все фото
              </p>
            </div>
          </a>
        </motion.div>

        {/* Why Choose Us */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6"
        >
          <h2 className="text-black mb-3" style={{ fontSize: '18px' }}>почему мы</h2>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white border-2 border-red-600 p-4"
                style={{ borderRadius: index % 2 === 0 ? '5px' : '50px' }}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <h3 className="text-black mb-1" style={{ fontSize: '16px' }}>{feature.title}</h3>
                <p className="text-gray-600" style={{ fontSize: '14px' }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Advantages List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6"
        >
          <h3 className="text-black mb-3" style={{ fontSize: '18px' }}>что мы предлагаем</h3>
          <div className="space-y-2">
            {advantages.map((advantage, index) => (
              <motion.div
                key={index}
                className="bg-gray-100 p-3 sm:p-4"
                style={{ borderRadius: '5px' }}
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <p className="text-black" style={{ fontSize: '14px' }}>{advantage}</p>
              </motion.div>
            ))}
            
            {/* Professional Audio Equipment - with hidden dev menu access */}
            <motion.button
              onClick={() => setShowAudioDialog(true)}
              className="w-full bg-gray-100 p-3 sm:p-4 text-left"
              style={{ borderRadius: '5px' }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <p className="text-black" style={{ fontSize: '14px' }}>профессиональное звуковое оборудование</p>
            </motion.button>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-6"
        >
          <h3 className="text-black mb-3" style={{ fontSize: '18px' }}>забронировать</h3>
          
          <AnimatePresence mode="wait">
            {!showPhone ? (
              <button
                key="button"
                onClick={() => setShowPhone(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white p-4 text-center transition-colors"
                style={{ 
                  borderRadius: '100px',
                  fontSize: '16px'
                }}
              >
                сделать звонок
              </button>
            ) : (
              <motion.div
                key="phone"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white border-2 border-red-600 p-5 text-center"
                style={{ borderRadius: '50px' }}
              >
                <p className="text-black mb-2" style={{ fontSize: '16px' }}>позвоните</p>
                <a 
                  href="tel:+79127037979"
                  className="text-red-600"
                  style={{ fontSize: '20px' }}
                >
                  +7 912 703 79 79
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Special Offer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div 
            className="bg-red-600 text-white p-5"
            style={{ borderRadius: '5px' }}
          >
            <h3 className="mb-1" style={{ fontSize: '18px' }}>специальное предложение</h3>
            <p style={{ fontSize: '14px' }}>при заказе банкета получите торт ручной работы в подарок</p>
          </div>
        </motion.div>
      </div>

      {/* Audio Equipment Dialog */}
      <AnimatePresence>
        {showAudioDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4"
            onClick={() => setShowAudioDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 max-w-md w-full"
              style={{ borderRadius: '30px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-black" style={{ fontSize: '20px' }}>
                  звуковое оборудование
                </h2>
                <button
                  onClick={() => setShowAudioDialog(false)}
                  className="p-1 hover:bg-gray-100 transition-colors"
                  style={{ borderRadius: '50%' }}
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              
              <p className="text-gray-600 mb-6" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                в перце установлено профессиональное звуковое оборудование высокого класса, 
                которое обеспечит идеальное качество звука для вашего мероприятия. 
                система поддерживает подключение микрофонов, музыкальных инструментов и 
                воспроизведение аудио с различных источников.
              </p>

              <button
                onClick={() => {
                  setShowAudioDialog(false);
                  setShowCodeDialog(true);
                }}
                className="w-full bg-gray-200 text-gray-700 p-3 transition-colors hover:bg-gray-300"
                style={{ borderRadius: '50px', fontSize: '14px' }}
              >
                режим
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Code Input Dialog */}
      <AnimatePresence>
        {showCodeDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[80] flex items-center justify-center p-4"
            onClick={() => setShowCodeDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 max-w-md w-full"
              style={{ borderRadius: '30px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-black mb-4" style={{ fontSize: '20px' }}>
                введите код
              </h2>
              
              <input
                type="text"
                value={devCode}
                onChange={(e) => setDevCode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleCodeSubmit()}
                placeholder="код доступа"
                className="w-full p-3 border-2 border-gray-300 mb-4"
                style={{ borderRadius: '15px', fontSize: '16px' }}
                autoFocus
              />

              <div className="flex gap-3">
                <button
                  onClick={handleCodeSubmit}
                  className="flex-1 bg-red-600 text-white p-3 transition-colors hover:bg-red-700"
                  style={{ borderRadius: '15px', fontSize: '16px' }}
                >
                  войти
                </button>
                <button
                  onClick={() => setShowCodeDialog(false)}
                  className="flex-1 bg-gray-200 text-gray-700 p-3 transition-colors hover:bg-gray-300"
                  style={{ borderRadius: '15px', fontSize: '16px' }}
                >
                  отмена
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Viewer */}
      <AnimatePresence>
        {viewingPhoto && (
          <PhotoViewer
            imageUrl={viewingPhoto}
            onClose={() => setViewingPhoto(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
