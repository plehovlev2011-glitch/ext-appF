import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DevMenuPageProps {
  onClose: () => void;
}

export function DevMenuPage({ onClose }: DevMenuPageProps) {
  const [activeTab, setActiveTab] = useState('data');

  // Функции для управления данными
  const addRandomChips = () => {
    const current = JSON.parse(localStorage.getItem('perecActiveChips') || '[]');
    const newChips = Array.from({ length: 3 }, (_, i) => current.length + i + 1);
    localStorage.setItem('perecActiveChips', JSON.stringify([...current, ...newChips]));
    window.location.reload();
  };

  const completeAllChips = () => {
    localStorage.setItem('perecActiveChips', JSON.stringify([1,2,3,4,5,6,7,8,9,10]));
    window.location.reload();
  };

  const clearAllChips = () => {
    localStorage.setItem('perecActiveChips', JSON.stringify([]));
    window.location.reload();
  };

  const resetAllData = () => {
    if (confirm('Удалить ВСЕ данные?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const resetSpins = () => {
    localStorage.removeItem('perecLastSpinDate');
    window.location.reload();
  };

  const clearBackups = () => {
    const backups = localStorage.getItem('perecBackups');
    if (backups) {
      const parsed = JSON.parse(backups);
      parsed.forEach((backup: any) => {
        localStorage.removeItem(`perecBackup_${backup.id}`);
      });
    }
    localStorage.removeItem('perecBackups');
    window.location.reload();
  };

  // Новые функции для анимаций
  const stressTestAnimations = () => {
    const elements = document.querySelectorAll('*');
    elements.forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.animation = 'shake 0.5s infinite';
      }
    });
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      elements.forEach(el => {
        if (el instanceof HTMLElement) {
          el.style.animation = '';
        }
      });
      style.remove();
    }, 3000);
  };

  const crashApp = () => {
    throw new Error('Искусственный краш приложения');
  };

  const disableAllFonts = () => {
    document.querySelectorAll('*').forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.fontFamily = 'monospace !important';
        el.style.fontSize = '12px !important';
        el.style.fontWeight = 'normal !important';
      }
    });
  };

  const enableAllFonts = () => {
    document.querySelectorAll('*').forEach(el => {
      if (el instanceof HTMLElement) {
        el.style.fontFamily = '';
        el.style.fontSize = '';
        el.style.fontWeight = '';
      }
    });
  };

  const toggleAnimations = () => {
    const root = document.documentElement;
    if (root.style.animationDuration === '0s') {
      root.style.animationDuration = '';
      root.style.transitionDuration = '';
    } else {
      root.style.animationDuration = '0s';
      root.style.transitionDuration = '0s';
    }
  };

  const simulateLowMemory = () => {
    const hugeArray = [];
    for (let i = 0; i < 1000000; i++) {
      hugeArray.push(new Array(1000).fill('memory stress'));
    }
    alert('Память заполнена. Закройте приложение.');
  };

  const infiniteLoop = () => {
    let i = 0;
    while (i < 1) {
      console.log('Бесконечный цикл...');
    }
  };

  const overrideTime = () => {
    const time = prompt('Введите время (HH:MM):');
    if (time) localStorage.setItem('devTimeOverride', time);
  };

  const overrideDate = () => {
    const date = prompt('Введите дату (YYYY-MM-DD):');
    if (date) localStorage.setItem('devDateOverride', date);
  };

  const clearTimeOverride = () => {
    localStorage.removeItem('devTimeOverride');
    localStorage.removeItem('devDateOverride');
  };

  const exportAllData = () => {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) data[key] = localStorage.getItem(key);
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perec-backup-${Date.now()}.json`;
    a.click();
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            Object.keys(data).forEach(key => {
              localStorage.setItem(key, data[key]);
            });
            window.location.reload();
          } catch (error) {
            alert('Ошибка импорта файла');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const toggleDarkMode = () => {
    document.documentElement.style.filter = document.documentElement.style.filter ? '' : 'invert(1) hue-rotate(180deg)';
  };

  const toggleDebugOverlay = () => {
    const existing = document.getElementById('debug-overlay');
    if (existing) {
      existing.remove();
    } else {
      const overlay = document.createElement('div');
      overlay.id = 'debug-overlay';
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        pointer-events: none;
        z-index: 9999;
        background: repeating-linear-gradient(0deg, transparent, transparent 19px, red 20px),
                   repeating-linear-gradient(90deg, transparent, transparent 19px, red 20px);
        opacity: 0.3;
      `;
      document.body.appendChild(overlay);
    }
  };

  const simulateSlowNetwork = () => {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(originalFetch.apply(this, args));
        }, 3000);
      });
    };
    alert('Медленная сеть включена (3 сек задержка)');
  };

  const resetNetwork = () => {
    window.fetch = window.fetch;
    alert('Сеть восстановлена');
  };

  const createHugeDom = () => {
    const container = document.createElement('div');
    for (let i = 0; i < 1000; i++) {
      const div = document.createElement('div');
      div.textContent = `DOM элемент ${i}`;
      container.appendChild(div);
    }
    document.body.appendChild(container);
  };

  const clearHugeDom = () => {
    const elements = document.querySelectorAll('div');
    elements.forEach(el => {
      if (el.textContent?.startsWith('DOM элемент')) {
        el.remove();
      }
    });
  };

  const buttons = {
    data: [
      { label: 'добавить 3 фишки', action: addRandomChips },
      { label: 'все фишки', action: completeAllChips },
      { label: 'очистить фишки', action: clearAllChips },
      { label: 'сбросить крутки', action: resetSpins },
      { label: 'очистить бэкапы', action: clearBackups },
      { label: 'экспорт данных', action: exportAllData },
      { label: 'импорт данных', action: importData },
      { label: 'полный сброс', action: resetAllData },
    ],
    time: [
      { label: 'переопределить время', action: overrideTime },
      { label: 'переопределить дату', action: overrideDate },
      { label: 'сбросить время', action: clearTimeOverride },
    ],
    debug: [
      { label: 'стресс-тест анимаций', action: stressTestAnimations },
      { label: 'вкл/выкл анимации', action: toggleAnimations },
      { label: 'отключить шрифты', action: disableAllFonts },
      { label: 'включить шрифты', action: enableAllFonts },
      { label: 'тёмный режим', action: toggleDarkMode },
      { label: 'отладка сетки', action: toggleDebugOverlay },
      { label: 'медленная сеть', action: simulateSlowNetwork },
      { label: 'нормальная сеть', action: resetNetwork },
      { label: 'создать DOM', action: createHugeDom },
      { label: 'очистить DOM', action: clearHugeDom },
    ],
    danger: [
      { label: 'краш приложения', action: crashApp },
      { label: 'заполнить память', action: simulateLowMemory },
      { label: 'бесконечный цикл', action: infiniteLoop },
    ]
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl">dev menu</h1>
          <button onClick={onClose} className="p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Табы */}
        <div className="flex gap-2 mb-4 border-b">
          {Object.keys(buttons).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 ${activeTab === tab ? 'border-b-2 border-red-600' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Кнопки */}
        <div className="space-y-2">
          {buttons[activeTab as keyof typeof buttons].map((button, index) => (
            <button
              key={index}
              onClick={button.action}
              className={`w-full p-3 text-left border ${
                activeTab === 'danger' ? 'border-red-600 bg-red-50' : 'border-gray-300'
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>

        {/* Статус */}
        <div className="mt-6 p-4 border border-gray-300">
          <h3 className="mb-2">статус</h3>
          <div className="text-sm space-y-1">
            <div>фишки: {JSON.parse(localStorage.getItem('perecActiveChips') || '[]').length}/10</div>
            <div>профиль: {localStorage.getItem('perecUserProfile') ? 'есть' : 'нет'}</div>
            <div>бэкапы: {JSON.parse(localStorage.getItem('perecBackups') || '[]').length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}