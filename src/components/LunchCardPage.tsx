import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface LunchCardPageProps {
  onClose: () => void;
}

type DialogState = 'none' | 'input' | 'success' | 'error' | 'accidentally';

const CHIP_CODES: { [key: string]: number } = {
  '21471': 1,
  '84079': 2,
  '90284': 3,
  '32476': 4,
  '57463': 5,
  '910478': 6,
  '189374': 7,
  '043571': 8,
  '504362': 9,
  '0398497': 10,
};

export function LunchCardPage({ onClose }: LunchCardPageProps) {
  const [activeChips, setActiveChips] = useState<number[]>([]);
  const [dialogState, setDialogState] = useState<DialogState>('none');
  const [codeInput, setCodeInput] = useState('');
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load active chips from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('perecActiveChips');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setActiveChips(parsed);
        }
      } catch (e) {
        console.error('Failed to parse active chips from localStorage');
      }
    }
  }, []);

  // Save active chips to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('perecActiveChips', JSON.stringify(activeChips));
  }, [activeChips]);



  const handleCodeSubmit = () => {
    const chipNumber = CHIP_CODES[codeInput];
    
    if (chipNumber) {
      // Check if this is the next chip in sequence
      const lastActiveChip = activeChips.length > 0 ? Math.max(...activeChips) : 0;
      
      if (chipNumber === lastActiveChip + 1 && !activeChips.includes(chipNumber)) {
        // Success! Add the chip
        setActiveChips([...activeChips, chipNumber]);
        setDialogState('success');
      } else {
        // Wrong sequence or already activated
        setDialogState('error');
      }
    } else {
      // Invalid code
      setDialogState('error');
    }
    
    setCodeInput('');
  };

  const handleErrorClose = () => {
    setDialogState('none');
  };

  const handleSuccessClose = () => {
    setDialogState('none');
  };

  const handleAccidentallyExit = () => {
    setDialogState('none');
    onClose();
  };

  useEffect(() => {
    if (dialogState === 'input' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [dialogState]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-white z-[60] overflow-y-auto"
    >
      <div className="min-h-screen bg-white pb-8 pt-12">
        {/* Header */}
        <div className="sticky top-12 bg-white z-10 px-4 pt-4 pb-3 flex items-center justify-between border-b-2 border-red-600">
          <h1 className="text-black" style={{ fontSize: '24px' }}>карта обедов</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 transition-colors"
            style={{ borderRadius: '50%' }}
          >
            <X className="w-6 h-6 text-red-600" />
          </button>
        </div>

        {/* Chips Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="px-4 mt-6"
        >
          <div className="bg-red-600 p-6" style={{ borderRadius: '20px' }}>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((chipNumber) => {
                const isActive = activeChips.includes(chipNumber);
                const lastActiveChip = activeChips.length > 0 ? Math.max(...activeChips) : 0;
                const isLastActive = chipNumber === lastActiveChip;

                return (
                  <div
                    key={chipNumber}
                    className="relative"
                    style={{ 
                      aspectRatio: '2.5',
                      userSelect: 'none',
                      WebkitUserSelect: 'none'
                    }}
                  >
                    <svg 
                      className="absolute inset-0 w-full h-full" 
                      fill="none" 
                      preserveAspectRatio="none" 
                      viewBox="0 0 500 212"
                    >
                      <ellipse
                        cx="250"
                        cy="106"
                        rx="243"
                        ry="99"
                        fill={isActive ? 'white' : 'transparent'}
                        stroke="white"
                        strokeWidth="7"
                      />
                    </svg>
                    {isActive && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-red-600" style={{ fontSize: '32px' }}>
                          {chipNumber}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="bg-white p-5" style={{ borderRadius: '50px' }}>
              <p className="text-black text-center" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                за каждую покупку от 250 рублей при предъявлении дисконтной карты получайте фишку в приложении.
              </p>
              <p className="text-black text-center mt-2" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                накопите 10 фишек - и 11-ая покупка станет бесплатной
              </p>
            </div>
          </div>
        </motion.div>

        {/* I'm at the cashier button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="px-4 mt-6 flex justify-center"
        >
          <button
            onClick={() => {
              setDialogState('input');
              setCodeInput('');
            }}
            className="px-6 py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
            style={{ borderRadius: '20px', fontSize: '14px' }}
          >
            я на кассе
          </button>
        </motion.div>
      </div>

      {/* Input Dialog */}
      <AnimatePresence>
        {dialogState === 'input' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4"
            onClick={() => setDialogState('accidentally')}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-200 p-6 max-w-md w-full"
              style={{ borderRadius: '30px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-black mb-4" style={{ fontSize: '18px' }}>
                отлично, теперь введите код, который скажет сотрудник
              </h2>
              
              <p className="text-black mb-6" style={{ fontSize: '12px', lineHeight: '1.6' }}>
                коды сотрудников обновляются каждые 10 минут.<br />
                они могут открыть для вас особые условия, скидки или персонализировать приложение.<br />
                чтобы получить код, сотрудник сканирует свой личный qr-код - в этот момент на его устройстве генерируется временный одноразовый код для ввода.<br />
                ввести этот код можно только в течение нескольких минут.<br />
                любая попытка ввести код, сгенерированный вне рабочего сеанса ввода кода сотрудника, приведет к аннулированию акции.<br />
                подделать или симулировать такой код невозможно.
              </p>

              <input
                ref={inputRef}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="введите код"
                className="w-full px-4 py-3 mb-4 bg-white border-2 border-gray-400 focus:outline-none focus:border-red-600"
                style={{ borderRadius: '9999px', fontSize: '16px', textAlign: 'center' }}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCodeSubmit();
                  }
                }}
              />

              <button
                onClick={handleCodeSubmit}
                className="w-full bg-red-600 text-white p-3 mb-3 transition-colors hover:bg-red-700"
                style={{ borderRadius: '9999px', fontSize: '16px' }}
              >
                ок
              </button>

              <button
                onClick={() => setDialogState('accidentally')}
                className="w-full bg-white text-black p-3 transition-colors hover:bg-gray-100"
                style={{ borderRadius: '9999px', fontSize: '14px' }}
              >
                отмена
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Dialog */}
      <AnimatePresence>
        {dialogState === 'success' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-red-600 p-6 max-w-md w-full"
              style={{ borderRadius: '30px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-white mb-6" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                супер!<br />
                код сработал, и для вас открылась новая фишка. проверим?
              </p>

              <button
                onClick={handleSuccessClose}
                className="w-full bg-white text-red-600 p-3 transition-colors hover:bg-gray-100"
                style={{ borderRadius: '9999px', fontSize: '16px' }}
              >
                блеск, давайте
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Dialog */}
      <AnimatePresence>
        {dialogState === 'error' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-red-600 p-6 max-w-md w-full"
              style={{ borderRadius: '30px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className="text-white mb-6" style={{ fontSize: '16px', lineHeight: '1.6' }}>
                этот код не сошёлся во времени и пространстве.<br />
                акция аннулирована. попробуйте с новым кодом от сотрудника.
              </p>

              <button
                onClick={handleErrorClose}
                className="w-full bg-white text-red-600 p-3 transition-colors hover:bg-gray-100"
                style={{ borderRadius: '9999px', fontSize: '16px' }}
              >
                эх, ладно
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Accidentally Dialog */}
      <AnimatePresence>
        {dialogState === 'accidentally' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-red-600 p-6 max-w-md w-full"
              style={{ borderRadius: '30px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-white mb-2" style={{ fontSize: '16px' }}>
                попали сюда случайно?
              </h2>
              
              <p className="text-white mb-6" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                вот кнопка выхода в главное меню - приготовили её специально для таких случаев
              </p>

              <button
                onClick={handleAccidentallyExit}
                className="w-full bg-white text-red-600 p-3 mb-3 transition-colors hover:bg-gray-100"
                style={{ borderRadius: '9999px', fontSize: '16px' }}
              >
                выйти
              </button>

              <button
                onClick={() => setDialogState('input')}
                className="w-full bg-white text-red-600 p-3 transition-colors hover:bg-gray-100"
                style={{ borderRadius: '9999px', fontSize: '14px' }}
              >
                вернуться к вводу кода
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
