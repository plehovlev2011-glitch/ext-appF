import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart } from 'lucide-react';
import imgReetime11 from "figma:asset/b6bfbd5372df33c461a3e5ababc251be77bee389.png";
import imgEc2979C27Ef30301C6Dc1787Bcd761Eb1 from "figma:asset/a036f3ba80d12e18bb773e7de4d5e3d6452dedf8.png";
import img15Dce3Fc2C68F441254187B3D352Fa141 from "figma:asset/8b224b7a596ddde005b4a81bf73eaf2efb05791d.png";

interface Story {
  id: number;
  title: string;
  content: string;
  image: string;
}

interface StoriesViewerProps {
  onClose: () => void;
  initialStoryIndex?: number;
}

const stories: Story[] = [
  {
    id: 1,
    title: 'программа лояльности',
    content: 'получите карту "вам выгода!" и экономьте 5% на каждой покупке',
    image: imgReetime11
  },
  {
    id: 2,
    title: 'доставка',
    content: 'заказывайте доставку через чиббис и яндекс go с 8:00 до 13:30',
    image: imgEc2979C27Ef30301C6Dc1787Bcd761Eb1
  },
  {
    id: 3,
    title: 'банкеты',
    content: 'организуем ваше мероприятие. просторный зал и вкусное меню',
    image: img15Dce3Fc2C68F441254187B3D352Fa141
  }
];

export function StoriesViewer({ onClose, initialStoryIndex = 0 }: StoriesViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialStoryIndex);
  const [progress, setProgress] = useState(0);
  const [viewedStories, setViewedStories] = useState<Set<number>>(new Set());
  const [likedStories, setLikedStories] = useState<Set<number>>(new Set());
  const duration = 5000; // 5 seconds per story

  useEffect(() => {
    setViewedStories(prev => new Set([...prev, stories[currentIndex].id]));
    
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        if (currentIndex < stories.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setProgress(0);
        } else {
          onClose();
        }
      }
    }, 50);

    return () => clearInterval(interval);
  }, [currentIndex, onClose]);

  const handleLike = () => {
    setLikedStories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stories[currentIndex].id)) {
        newSet.delete(stories[currentIndex].id);
      } else {
        newSet.add(stories[currentIndex].id);
      }
      return newSet;
    });
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const currentStory = stories[currentIndex];
  const isLiked = likedStories.has(currentStory.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 flex gap-1 p-4 z-20">
        {stories.map((story, index) => (
          <div key={story.id} className="flex-1 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white"
              initial={{ width: '0%' }}
              animate={{
                width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%'
              }}
              transition={{ duration: 0.1 }}
            />
          </div>
        ))}
      </div>

      {/* Story content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStory.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full relative"
        >
          {/* Background image with overlay */}
          <div className="absolute inset-0">
            <img 
              src={currentStory.image} 
              alt={currentStory.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
          </div>

          {/* Text content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white text-center mb-6" 
              style={{ fontSize: '32px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            >
              {currentStory.title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white text-center max-w-md" 
              style={{ fontSize: '18px', textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
            >
              {currentStory.content}
            </motion.p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation areas */}
      <div className="absolute inset-0 flex z-10">
        <button
          onClick={handlePrevious}
          className="flex-1"
          disabled={currentIndex === 0}
        />
        <button
          onClick={handleNext}
          className="flex-1"
        />
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex items-center justify-between px-8">
        {/* Close button */}
        <motion.button
          onClick={onClose}
          className="text-white"
          whileTap={{ scale: 0.9 }}
        >
          <X 
            size={40} 
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          />
        </motion.button>

        {/* Like button */}
        <motion.button
          onClick={handleLike}
          whileTap={{ scale: 0.8 }}
          animate={isLiked ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <Heart
            size={40}
            className={isLiked ? 'fill-white text-white' : 'text-white'}
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}