import { motion } from 'motion/react';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function NavigationBar({ activeTab, onTabChange }: NavigationBarProps) {
  const tabs = [
    { id: 'home', label: 'дом', flex: 1.5, rx: '215.5', ry: '120.5', viewBoxWidth: '431' },
    { id: 'bonuses', label: 'доставим', flex: 2.3, rx: '337.5', ry: '120.5', viewBoxWidth: '675' },
    { id: 'delivery', label: 'торжества', flex: 2.1, rx: '315.5', ry: '120.5', viewBoxWidth: '631' },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-50 px-4">
      <div className="max-w-md mx-auto">
        <div className="relative flex items-center justify-between gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative"
                style={{ 
                  flex: tab.flex,
                  minWidth: 0,
                  height: '50px'
                }}
                whileTap={{ scale: 0.95 }}
              >
                {/* SVG Background */}
                <svg 
                  className="absolute inset-0 w-full h-full" 
                  fill="none" 
                  preserveAspectRatio="none" 
                  viewBox={`0 0 ${tab.viewBoxWidth} 241`}
                >
                  <ellipse 
                    cx={tab.rx} 
                    cy={tab.ry} 
                    fill={isActive ? '#FF0000' : '#FFCACA'} 
                    rx={tab.rx} 
                    ry={tab.ry} 
                  />
                </svg>
                
                {/* Text */}
                <div className="absolute inset-0 flex items-center justify-center px-2">
                  <p 
                    className={`${isActive ? 'text-white' : 'text-black'} whitespace-nowrap`}
                    style={{ fontSize: '12px' }}
                  >
                    {tab.label}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
