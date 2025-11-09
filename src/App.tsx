import { useState, useEffect } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { MainApp } from './components/MainApp';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Удалил инициализацию хранилища чтобы избежать ошибок
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
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
