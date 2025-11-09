import { useState } from 'react';
import { motion } from 'motion/react';
import { StoriesViewer } from './StoriesViewer';

interface Story {
  id: number;
  title: string;
  color: string;
}

const stories: Story[] = [
  { id: 1, title: 'лояльность', color: '#FF0000' },
  { id: 2, title: 'доставка', color: '#FFCACA' },
  { id: 3, title: 'банкеты', color: '#FF0000' }
];

interface NewStoriesBarProps {
  onStoriesOpen?: (open: boolean) => void;
}

export function NewStoriesBar({ onStoriesOpen }: NewStoriesBarProps) {
  const [viewedStories, setViewedStories] = useState<Set<number>>(new Set());
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
    setViewedStories(prev => new Set([...prev, stories[index].id]));
    onStoriesOpen?.(true);
  };

  const handleCloseViewer = () => {
    setSelectedStoryIndex(null);
    onStoriesOpen?.(false);
  };

  return (
    <>
      <div className="flex gap-4 px-4 py-4 overflow-x-auto">
        {stories.map((story, index) => {
          const isViewed = viewedStories.has(story.id);
          
          return (
            <motion.button
              key={story.id}
              onClick={() => handleStoryClick(index)}
              className="flex flex-col items-center gap-2 flex-shrink-0"
              whileTap={{ scale: 0.95 }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center relative"
                style={{
                  background: isViewed
                    ? 'linear-gradient(to right, #E5E5E5, #D1D1D1)'
                    : 'linear-gradient(135deg, #FF0000, #FF6B6B)',
                  padding: '3px'
                }}
              >
                <div
                  className="w-full h-full rounded-full flex items-center justify-center"
                  style={{ backgroundColor: story.color }}
                >
                  <span className="text-white" style={{ fontSize: '24px' }}>
                    {story.title.charAt(0)}
                  </span>
                </div>
              </div>
              <span
                className={isViewed ? 'text-gray-400' : 'text-black'}
                style={{ fontSize: '12px' }}
              >
                {story.title}
              </span>
            </motion.button>
          );
        })}
      </div>

      {selectedStoryIndex !== null && (
        <StoriesViewer
          onClose={handleCloseViewer}
          initialStoryIndex={selectedStoryIndex}
        />
      )}
    </>
  );
}