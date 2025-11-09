import { motion } from 'motion/react';

interface TopNavBarProps {
  visible: boolean;
}

export function TopNavBar({ visible }: TopNavBarProps) {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-40 bg-white transition-transform duration-300"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      }}
    >
      <div className="flex items-center justify-center px-4 sm:px-6 py-3 sm:py-4">
        <h1 className="text-xl sm:text-2xl">.</h1>
      </div>
    </motion.div>
  );
}
