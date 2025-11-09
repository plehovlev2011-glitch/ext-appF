import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Edit3, Info, RotateCw, Crop, Filter, Check } from 'lucide-react';

interface PhotoViewerProps {
  imageUrl: string;
  onClose: () => void;
}

type EditMode = 'crop' | 'rotate' | 'filter' | null;
type FilterType = 'none' | 'vintage' | 'blackwhite' | 'warm' | 'cool';

export function PhotoViewer({ imageUrl, onClose }: PhotoViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showInfo, setShowInfo] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [rotation, setRotation] = useState(0);
  const [currentFilter, setCurrentFilter] = useState<FilterType>('none');
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  
  const touchStartRef = useRef({ x: 0, y: 0, distance: 0, scale: 1 });
  const lastTouchRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimerRef = useRef<NodeJS.Timeout>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Таймер скрытия контролов
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  }, []);

  useEffect(() => {
    resetControlsTimer();
    return () => clearTimeout(controlsTimerRef.current);
  }, [resetControlsTimer]);

  // Плавный зум с ограничениями
  const handleZoom = useCallback((newScale: number, clientX?: number, clientY?: number) => {
    const container = containerRef.current;
    if (!container) return;

    const boundedScale = Math.min(Math.max(0.5, newScale), 5);
    
    if (clientX && clientY && editMode === null) {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (clientX - centerX) * (boundedScale - scale) / scale;
      const deltaY = (clientY - centerY) * (boundedScale - scale) / scale;
      
      setPosition(prev => ({
        x: prev.x - deltaX,
        y: prev.y - deltaY
      }));
    }
    
    setScale(boundedScale);
    resetControlsTimer();
  }, [scale, editMode, resetControlsTimer]);

  // Обработчик жестов для мобилки
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touches = e.touches;
    
    if (touches.length === 1 && editMode === null) {
      isDraggingRef.current = true;
      lastTouchRef.current = {
        x: touches[0].clientX - position.x,
        y: touches[0].clientY - position.y
      };
    } else if (touches.length === 2 && editMode === null) {
      isDraggingRef.current = false;
      const touch1 = touches[0];
      const touch2 = touches[1];
      
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      touchStartRef.current = {
        x: (touch1.clientX + touch2.clientX) / 2,
        y: (touch1.clientY + touch2.clientY) / 2,
        distance,
        scale
      };
    }
    
    resetControlsTimer();
  }, [position.x, position.y, scale, editMode, resetControlsTimer]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touches = e.touches;
    
    if (touches.length === 1 && isDraggingRef.current && editMode === null) {
      const touch = touches[0];
      setPosition({
        x: touch.clientX - lastTouchRef.current.x,
        y: touch.clientY - lastTouchRef.current.y
      });
      resetControlsTimer();
    } else if (touches.length === 2 && editMode === null) {
      e.preventDefault();
      
      const touch1 = touches[0];
      const touch2 = touches[1];
      
      const currentDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
      
      const zoomFactor = currentDistance / touchStartRef.current.distance;
      const newScale = touchStartRef.current.scale * zoomFactor;
      
      const centerX = (touch1.clientX + touch2.clientX) / 2;
      const centerY = (touch1.clientY + touch2.clientY) / 2;
      
      handleZoom(newScale, centerX, centerY);
    }
  }, [handleZoom, editMode, resetControlsTimer]);

  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    resetControlsTimer();
  }, [resetControlsTimer]);

  // Двойной тап для зума
  const handleDoubleTap = useCallback((e: React.TouchEvent) => {
    if (editMode !== null) return;
    
    const touch = e.touches[0];
    const newScale = scale === 1 ? 2 : 1;
    handleZoom(newScale, touch.clientX, touch.clientY);
  }, [scale, handleZoom, editMode]);

  let tapCount = 0;
  let tapTimer: NodeJS.Timeout;

  const handleTap = useCallback((e: React.TouchEvent) => {
    tapCount++;
    
    if (tapCount === 1) {
      tapTimer = setTimeout(() => {
        tapCount = 0;
        // Одиночный тап - показать/скрыть контролы
        setShowControls(prev => !prev);
      }, 300);
    } else if (tapCount === 2) {
      clearTimeout(tapTimer);
      tapCount = 0;
      handleDoubleTap(e);
    }
  }, [handleDoubleTap]);

  // Сброс позиции при изменении scale
  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
    setCurrentFilter('none');
    resetControlsTimer();
  }, [resetControlsTimer]);

  // Применение фильтров через Canvas
  const applyFilter = useCallback((image: HTMLImageElement, filter: FilterType): string => {
    const canvas = canvasRef.current;
    if (!canvas) return imageUrl;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return imageUrl;
    
    canvas.width = image.width;
    canvas.height = image.height;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    switch (filter) {
      case 'vintage':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.1); // R
          data[i + 1] = data[i + 1] * 0.9; // G
          data[i + 2] = data[i + 2] * 0.8; // B
        }
        break;
      case 'blackwhite':
        for (let i = 0; i < data.length; i += 4) {
          const gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
          data[i] = data[i + 1] = data[i + 2] = gray;
        }
        break;
      case 'warm':
        for (let i = 0; i < data.length; i += 4) {
          data[i] = Math.min(255, data[i] * 1.2); // R
          data[i + 1] = Math.min(255, data[i + 1] * 1.1); // G
        }
        break;
      case 'cool':
        for (let i = 0; i < data.length; i += 4) {
          data[i + 2] = Math.min(255, data[i + 2] * 1.2); // B
        }
        break;
    }
    
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.9);
  }, [imageUrl]);

  const handleDownload = useCallback(() => {
    const link = document.createElement('a');
    
    if (currentFilter !== 'none' || rotation !== 0) {
      // Создаем обработанное изображение
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        let processedUrl = imageUrl;
        
        if (currentFilter !== 'none') {
          processedUrl = applyFilter(img, currentFilter);
        }
        
        link.href = processedUrl;
        link.download = 'perec-edited-photo.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      img.src = imageUrl;
    } else {
      // Оригинальное изображение
      link.href = imageUrl;
      link.download = 'perec-photo.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    resetControlsTimer();
  }, [imageUrl, currentFilter, rotation, applyFilter, resetControlsTimer]);

  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
    resetControlsTimer();
  }, [resetControlsTimer]);

  const handleCropApply = useCallback(() => {
    // Здесь была бы логика применения кропа через Canvas
    alert('Фото успешно обрезано!');
    setEditMode(null);
    resetControlsTimer();
  }, [resetControlsTimer]);

  const getFilterClass = useCallback((filter: FilterType) => {
    switch (filter) {
      case 'vintage': return 'sepia(0.5) contrast(1.2)';
      case 'blackwhite': return 'grayscale(1) contrast(1.1)';
      case 'warm': return 'saturate(1.3) hue-rotate(-10deg)';
      case 'cool': return 'saturate(0.8) hue-rotate(10deg) brightness(1.1)';
      default: return 'none';
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-[100] touch-none"
      ref={containerRef}
      onTouchStart={resetControlsTimer}
      onTouchMove={resetControlsTimer}
    >
      {/* Скрытый canvas для обработки изображений */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Основные контролы */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-4 right-4 z-10 flex gap-2"
          >
            <button
              onClick={() => {
                setEditMode(editMode ? null : 'crop');
                resetControlsTimer();
              }}
              className="p-3 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-full"
            >
              <Crop className="w-5 h-5" />
            </button>
            <button
              onClick={handleRotate}
              className="p-3 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-full"
            >
              <RotateCw className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-3 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-full"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowInfo(true)}
              className="p-3 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-full"
            >
              <Info className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-3 bg-red-600 text-white hover:bg-red-700 transition-colors rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Индикатор зума */}
      {scale !== 1 && showControls && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-4 left-4 z-10 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm"
        >
          {Math.round(scale * 100)}%
          <button 
            onClick={handleReset}
            className="ml-2 text-red-400 hover:text-red-300"
          >
            сброс
          </button>
        </motion.div>
      )}

      {/* Панель редактирования */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-90 z-20 p-4 rounded-t-2xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-medium">
                {editMode === 'crop' && 'Обрезка фото'}
                {editMode === 'rotate' && 'Поворот'}
                {editMode === 'filter' && 'Фильтры'}
              </h3>
              <button
                onClick={() => setEditMode(null)}
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editMode === 'crop' && (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4 text-center text-white text-sm">
                  Перетащите границы для обрезки
                </div>
                <button
                  onClick={handleCropApply}
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5" />
                  Применить обрезку
                </button>
              </div>
            )}

            {editMode === 'filter' && (
              <div className="grid grid-cols-4 gap-2">
                {(['none', 'vintage', 'blackwhite', 'warm', 'cool'] as FilterType[]).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setCurrentFilter(filter)}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      currentFilter === filter 
                        ? 'border-red-500 bg-red-500 bg-opacity-20' 
                        : 'border-gray-600 bg-gray-700'
                    }`}
                  >
                    <div 
                      className="w-12 h-12 rounded-lg mb-1 border border-gray-500"
                      style={{ filter: getFilterClass(filter) }}
                    />
                    <span className="text-white text-xs">
                      {filter === 'none' && 'Оригинал'}
                      {filter === 'vintage' && 'Винтаж'}
                      {filter === 'blackwhite' && 'Ч/Б'}
                      {filter === 'warm' && 'Тёплый'}
                      {filter === 'cool' && 'Холодный'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Изображение */}
      <div 
        className="w-full h-full flex items-center justify-center overflow-hidden"
        onTouchStart={(e) => {
          handleTouchStart(e);
          handleTap(e);
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.img
          src={imageUrl}
          alt="Просмотр фото"
          className="max-w-full max-h-full object-contain select-none transition-transform duration-100"
          style={{
            transform: `scale(${scale}) translate3d(${position.x}px, ${position.y}px, 0) rotate(${rotation}deg)`,
            cursor: isDraggingRef.current ? 'grabbing' : 'grab',
            filter: getFilterClass(currentFilter)
          }}
          draggable={false}
        />
      </div>

      {/* Информационное окно */}
      <AnimatePresence>
        {showInfo && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50 z-30"
              onClick={() => setShowInfo(false)}
            />
            
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25 }}
              className="absolute bottom-0 left-0 right-0 bg-white z-40 rounded-t-3xl touch-none"
            >
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-12 h-1 bg-gray-300 rounded-full" />
              </div>

              <div className="px-6 pb-8 max-h-[60vh] overflow-y-auto">
                <h3 className="text-xl font-semibold mb-4 text-center">о этом торжестве</h3>
                
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {`0764534204`}
                    </p>
                  </div>
                  
                  <div className="bg-red-50 rounded-xl p-4">
                    <p className="text-red-700 text-sm">
                      🎉 Стол накрыт по всем традициям «ПЕРЦА» — с любовью к деталям и вниманием к каждому гостю
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowInfo(false)}
                  className="w-full mt-6 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors font-medium"
                >
                  понятно
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}