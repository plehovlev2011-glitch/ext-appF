import { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { MainApp } from './components/MainApp';
import { persistentStorage } from './utils/storage';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Инициализация хранилища при загрузке приложения
    const initStorage = async () => {
      try {
        // Предзагружаем важные данные из хранилища
        const userData = persistentStorage.getItem('userData');
        const cartData = persistentStorage.getItem('cart');
        const appSettings = persistentStorage.getItem('appSettings');
        
        console.log('Storage initialized:', {
          userData: userData ? 'exists' : 'empty',
          cartData: cartData ? 'exists' : 'empty',
          appSettings: appSettings ? 'exists' : 'empty'
        });
        
        // Устанавливаем таймер для периодического бэкапа
        const backupInterval = setInterval(() => {
          if (typeof (persistentStorage as any).sendBackupToParent === 'function') {
            (persistentStorage as any).sendBackupToParent();
          }
        }, 30000); // Каждые 30 секунд
        
        // Очистка интервала при размонтировании
        return () => clearInterval(backupInterval);
        
      } catch (error) {
        console.warn('Storage initialization error:', error);
      }
    };

    initStorage();
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      {!isLoading && <MainApp />}
    </>
  );
}