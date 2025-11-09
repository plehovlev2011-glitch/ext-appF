import { useState } from 'react';
import storiesImage from 'figma:asset/4c041ed02b15714e8dacacb6c66b8ac4af150436.png';

interface Story {
  id: number;
  image: string;
  title: string;
}

export function StoriesBar() {
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  
  const stories: Story[] = [
    { id: 1, image: storiesImage, title: 'секрет вкуса' },
    { id: 2, image: storiesImage, title: 'всегда свежее' },
    { id: 3, image: storiesImage, title: 'доставим' },
    { id: 4, image: storiesImage, title: 'ещё' },
  ];

  const handleStoryClick = (id: number) => {
    setSelectedStory(id);
    setTimeout(() => setSelectedStory(null), 3000);
  };

  return (
    <>
      {/* Stories Bar */}
      <div className="w-full overflow-x-auto bg-white pb-4">
        <div className="flex gap-3 px-0">
          {stories.map((story) => (
            <button
              key={story.id}
              onClick={() => handleStoryClick(story.id)}
              className="flex-shrink-0"
            >
              <img 
                src={story.image} 
                alt={story.title}
                className="w-full h-auto"
              />
            </button>
          ))}
        </div>
      </div>

      {/* Story Viewer */}
      {selectedStory !== null && (
        <div 
          className="fixed inset-0 z-50 bg-black flex items-center justify-center"
          onClick={() => setSelectedStory(null)}
        >
          <div className="relative w-full max-w-md h-full">
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-800 z-10">
              <div 
                className="h-full bg-white animate-progress"
                style={{
                  animation: 'progress 3s linear forwards'
                }}
              />
            </div>
            
            {/* Story content */}
            <img 
              src={stories.find(s => s.id === selectedStory)?.image}
              alt="Story"
              className="w-full h-full object-contain"
            />
            
            {/* Close button */}
            <button 
              onClick={() => setSelectedStory(null)}
              className="absolute top-4 right-4 text-white text-3xl"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </>
  );
}