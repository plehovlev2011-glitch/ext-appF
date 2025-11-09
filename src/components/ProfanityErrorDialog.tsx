import { motion, AnimatePresence } from 'motion/react';

interface ProfanityErrorDialogProps {
  show: boolean;
  onClose: () => void;
}

export function ProfanityErrorDialog({ show, onClose }: ProfanityErrorDialogProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-[80] flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-200 p-8 max-w-md w-full relative"
            style={{ borderRadius: '50px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Angry emoji */}
            <div className="text-center mb-4">
              <p className="text-black" style={{ fontSize: '48px', lineHeight: '1' }}>
                {'>:o'}
              </p>
            </div>

            {/* Message */}
            <p className="text-black text-center mb-6" style={{ fontSize: '16px', lineHeight: '1.6' }}>
              у нас, конечно, остро, но не до такой же степени.
              <br />
              давайте без нецензурщины.
            </p>

            {/* Button */}
            <button
              onClick={onClose}
              className="w-full bg-red-600 text-white p-3 transition-colors hover:bg-red-700"
              style={{ borderRadius: '9999px', fontSize: '16px' }}
            >
              ясно
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
