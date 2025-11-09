import { motion } from 'motion/react';
import { NewStoriesBar } from './NewStoriesBar';

export function BonusesPage() {
  return (
    <div className="min-h-screen bg-white pb-32">
      {/* New Stories Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4"
      >
        <NewStoriesBar />
      </motion.div>

      {/* Placeholder content */}
      <div className="px-4">
        <h1 className="text-black mb-4" style={{ fontSize: '24px' }}>вам выгода!</h1>
        <p className="text-gray-600" style={{ fontSize: '16px' }}>
          Эта страница в разработке
        </p>
      </div>
    </div>
  );
}