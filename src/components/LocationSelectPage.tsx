import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Check } from 'lucide-react';

interface LocationSelectPageProps {
  onClose: () => void;
}

export function LocationSelectPage({ onClose }: LocationSelectPageProps) {
  const [selectedLocation, setSelectedLocation] = useState('gorky');
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleFeedbackSubmit = () => {
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setShowFeedbackDialog(false);
      setFeedbackSubmitted(false);
    }, 2000);
  };

  return (
    <>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-0 bg-white z-[70] overflow-y-auto"
      >
        <div className="min-h-screen bg-white pb-8 pt-12">
          {/* Header */}
          <div className="sticky top-12 bg-white z-10 px-4 pt-4 pb-3 flex items-center justify-between border-b-2 border-red-600">
            <h1 className="text-black" style={{ fontSize: '24px' }}>предприятие</h1>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-50 transition-colors"
              style={{ borderRadius: '50%' }}
            >
              <X className="w-6 h-6 text-red-600" />
            </button>
          </div>

          {/* Location List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="px-4 mt-6"
          >
            <button
              onClick={() => setSelectedLocation('gorky')}
              className={`w-full p-5 mb-4 transition-all ${
                selectedLocation === 'gorky' ? 'bg-red-600 text-white' : 'bg-white border-2 border-red-600 text-black'
              }`}
              style={{ borderRadius: '20px' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MapPin className={`w-6 h-6 ${selectedLocation === 'gorky' ? 'text-white' : 'text-red-600'}`} />
                  <div className="text-left">
                    <p style={{ fontSize: '16px' }}>горького 63к1</p>
                    <p style={{ fontSize: '14px', opacity: 0.8 }}>киров</p>
                  </div>
                </div>
                {selectedLocation === 'gorky' && (
                  <Check className="w-6 h-6 text-white" />
                )}
              </div>
            </button>
          </motion.div>

          {/* Feedback Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="px-4 mt-8"
          >
            <div className="bg-gray-100 p-5" style={{ borderRadius: '20px' }}>
              <h2 className="text-black mb-3" style={{ fontSize: '18px' }}>
                хотите, чтобы мы открылись где-нибудь ещё?
              </h2>
              <p className="text-gray-600 mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                оставьте свои пожелания, и мы обязательно их рассмотрим
              </p>
              <button
                onClick={() => setShowFeedbackDialog(true)}
                className="w-full bg-red-600 text-white p-3 transition-colors hover:bg-red-700"
                style={{ borderRadius: '50px', fontSize: '16px' }}
              >
                да!
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Feedback Dialog */}
      <AnimatePresence>
        {showFeedbackDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[80] flex items-center justify-center p-4"
            onClick={() => !feedbackSubmitted && setShowFeedbackDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-6 max-w-md w-full"
              style={{ borderRadius: '30px' }}
              onClick={(e) => e.stopPropagation()}
            >
              {!feedbackSubmitted ? (
                <>
                  <h2 className="text-black mb-4" style={{ fontSize: '20px' }}>
                    спасибо за интерес!
                  </h2>
                  <p className="text-gray-600 mb-6" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    ваш отклик очень важен для нас. мы обязательно рассмотрим возможность открытия новых точек в вашем районе.
                  </p>
                  <button
                    onClick={handleFeedbackSubmit}
                    className="w-full bg-red-600 text-white p-3 transition-colors hover:bg-red-700"
                    style={{ borderRadius: '50px', fontSize: '16px' }}
                  >
                    отправить
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  </motion.div>
                  <p className="text-black" style={{ fontSize: '16px' }}>
                    отправлено!
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
