import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Camera, Bell, Shield, Info, Database, Download, Upload, Trash2, User, Mail, Phone } from 'lucide-react';
import { containsProfanity } from '../utils/profanityFilter';
import { ProfanityErrorDialog } from './ProfanityErrorDialog';

interface AccountPageProps {
  onClose: () => void;
}

interface UserProfile {
  name: string;
  birthdate: string;
  photo: string | null;
  hideNameInGreeting: boolean;
  email: string;
  phone: string;
}

export function AccountPage({ onClose }: AccountPageProps) {
  const [profile, setProfile] = useState<UserProfile>({ 
    name: '', 
    birthdate: '',
    photo: null,
    hideNameInGreeting: false,
    email: '',
    phone: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [pressProgress, setPressProgress] = useState(0);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [showProfanityError, setShowProfanityError] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Загружаем профиль при монтировании
  useEffect(() => {
    const savedProfile = localStorage.getItem('perecUserProfile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setProfile(prev => ({ 
          ...prev, 
          ...parsed 
        }));
      } catch (e) {
        console.error('Не удалось загрузить профиль');
      }
    }
  }, []);

  const handleSave = () => {
    if (profile.name && containsProfanity(profile.name)) {
      setShowProfanityError(true);
      return;
    }

    localStorage.setItem('perecUserProfile', JSON.stringify(profile));
    window.dispatchEvent(new Event('profileUpdated'));
    setIsEditing(false);
  };

  const handleLongPressStart = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setPressProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsEditing(true);
        setPressProgress(0);
      }
    }, 30);
    setPressTimer(interval);
  };

  const handleLongPressEnd = () => {
    if (pressTimer) {
      clearInterval(pressTimer);
      setPressTimer(null);
      setPressProgress(0);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newProfile = { 
          ...profile, 
          photo: reader.result as string 
        };
        setProfile(newProfile);
        localStorage.setItem('perecUserProfile', JSON.stringify(newProfile));
        window.dispatchEvent(new Event('profileUpdated'));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateBackup = () => {
    setIsCreatingBackup(true);
    
    setTimeout(() => {
      const backupData = {
        profile: localStorage.getItem('perecUserProfile'),
        activeChips: localStorage.getItem('perecActiveChips'),
        promos: localStorage.getItem('perecGeneratedPromos'),
        lastSpinDate: localStorage.getItem('perecLastSpinDate'),
        timestamp: new Date().toISOString()
      };
      
      const backupId = Date.now().toString();
      const backup = {
        id: backupId,
        name: `Резервная копия ${new Date().toLocaleString('ru-RU')}`,
        date: new Date().toLocaleString('ru-RU', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        size: '~2.5 МБ'
      };
      
      localStorage.setItem(`perecBackup_${backupId}`, JSON.stringify(backupData));
      
      const backupsStr = localStorage.getItem('perecBackups');
      const backups = backupsStr ? JSON.parse(backupsStr) : [];
      backups.push(backup);
      localStorage.setItem('perecBackups', JSON.stringify(backups));
      
      setIsCreatingBackup(false);
      setShowBackupDialog(false);
    }, 1500);
  };

  // Новые функции
  const exportProfileData = () => {
    const data = {
      profile: localStorage.getItem('perecUserProfile'),
      activeChips: localStorage.getItem('perecActiveChips'),
      promos: localStorage.getItem('perecGeneratedPromos'),
      lastSpinDate: localStorage.getItem('perecLastSpinDate'),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perec-profile-${Date.now()}.json`;
    a.click();
    setShowExportDialog(false);
  };

  const importProfileData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          
          if (data.profile) {
            localStorage.setItem('perecUserProfile', data.profile);
            setProfile(JSON.parse(data.profile));
          }
          if (data.activeChips) localStorage.setItem('perecActiveChips', data.activeChips);
          if (data.promos) localStorage.setItem('perecGeneratedPromos', data.promos);
          if (data.lastSpinDate) localStorage.setItem('perecLastSpinDate', data.lastSpinDate);
          
          window.dispatchEvent(new Event('profileUpdated'));
          setShowImportDialog(false);
          alert('Данные успешно импортированы!');
        } catch (error) {
          alert('Ошибка при импорте файла');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearProfilePhoto = () => {
    const newProfile = { ...profile, photo: null };
    setProfile(newProfile);
    localStorage.setItem('perecUserProfile', JSON.stringify(newProfile));
    window.dispatchEvent(new Event('profileUpdated'));
  };

  const resetAllData = () => {
    if (confirm('Вы уверены? Это удалит все ваши данные.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const estimatedSize = '~2.5 МБ';
  const isNameEmpty = !profile.name.trim();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gray-50 z-50 overflow-y-auto"
    >
      {/* Верхний бар с точкой */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-red-600 z-50"></div>

      <div className="min-h-screen pb-20 pt-1">
        {/* Шапка */}
        <div className="sticky top-1 bg-gray-50 z-10 px-4 pt-4 pb-3 flex items-center justify-between border-b border-gray-200">
          <h1 className="text-2xl text-black font-normal text-center flex-1">мой профиль</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 transition-colors rounded-full"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Фотография профиля */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="px-4 mt-6 flex flex-col items-center"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {profile.photo ? (
                <img 
                  src={profile.photo} 
                  alt="Профиль" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-12 h-12 text-gray-400" />
              )}
            </div>
            {isEditing && (
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                </button>
                {profile.photo && (
                  <button
                    onClick={clearProfilePhoto}
                    className="p-2 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </motion.div>

        {/* Информация профиля */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="px-4 mt-6"
        >
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="text-lg text-black mb-4 text-center">личные данные</h2>
            
            <div className="space-y-4">
              {/* Имя */}
              <div>
                <label className="block text-gray-500 text-sm mb-2 text-center">имя</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="введите ваше имя"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:bg-gray-100 text-base text-center"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <p className="text-black text-base text-center">{profile.name || 'не указано'}</p>
                  </div>
                )}
              </div>

              {/* Дата рождения */}
              <div>
                <label className="block text-gray-500 text-sm mb-2 text-center">дата рождения</label>
                {isEditing ? (
                  <input
                    type="date"
                    value={profile.birthdate}
                    onChange={(e) => setProfile(prev => ({ ...prev, birthdate: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:bg-gray-100 text-base text-center"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-xl">
                    <p className="text-black text-base text-center">
                      {profile.birthdate ? new Date(profile.birthdate).toLocaleDateString('ru-RU') : 'не указано'}
                    </p>
                  </div>
                )}
              </div>

              {/* Email */}
              {isEditing && (
                <div>
                  <label className="block text-gray-500 text-sm mb-2 text-center">email</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:bg-gray-100 text-base text-center"
                  />
                </div>
              )}

              {/* Телефон */}
              {isEditing && (
                <div>
                  <label className="block text-gray-500 text-sm mb-2 text-center">телефон</label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+7 999 123-45-67"
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border-0 focus:outline-none focus:bg-gray-100 text-base text-center"
                  />
                </div>
              )}
            </div>

            {/* Кнопки редактирования/сохранения */}
            {isEditing ? (
              <div className="space-y-3 mt-6">
                <button
                  onClick={handleSave}
                  className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors text-base font-medium text-center"
                >
                  сохранить изменения
                </button>
                <button
                  onClick={() => {
                    const savedProfile = localStorage.getItem('perecUserProfile');
                    if (savedProfile) {
                      setProfile(prev => ({ ...prev, ...JSON.parse(savedProfile) }));
                    }
                    setIsEditing(false);
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors text-base text-center"
                >
                  отменить
                </button>
              </div>
            ) : (
              <div className="relative mt-6">
                <button
                  onMouseDown={handleLongPressStart}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={handleLongPressStart}
                  onTouchEnd={handleLongPressEnd}
                  className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors relative overflow-hidden text-sm font-medium text-center"
                >
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-red-800 transition-all duration-300"
                    style={{ width: `${pressProgress}%` }}
                  />
                  <span className="relative z-10">
                    {pressProgress > 0 ? 'отпустите чтобы редактировать...' : 'держите для редактирования'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Настройки */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="px-4 mt-4"
        >
          <div className="bg-white rounded-2xl shadow-sm">
            <h2 className="text-lg text-black px-5 pt-5 pb-3 text-center">настройки</h2>
            
            {/* Переключатель скрытия имени */}
            <div className="px-5 py-4 flex items-center justify-between border-t border-gray-100">
              <div className="flex-1 pr-4">
                <p className="text-black text-sm mb-1 text-center">не упоминать моё имя</p>
                <p className="text-gray-500 text-xs text-center">при загрузке приложения и главном экране</p>
              </div>
              <button
                onClick={() => {
                  if (!isNameEmpty) {
                    const newProfile = { ...profile, hideNameInGreeting: !profile.hideNameInGreeting };
                    setProfile(newProfile);
                    localStorage.setItem('perecUserProfile', JSON.stringify(newProfile));
                    window.dispatchEvent(new Event('profileUpdated'));
                  }
                }}
                className={`w-12 h-6 rounded-full transition-colors relative ${
                  profile.hideNameInGreeting ? 'bg-red-600' : 'bg-gray-300'
                } ${isNameEmpty ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isNameEmpty}
              >
                <motion.div
                  className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm"
                  initial={false}
                  animate={{ 
                    x: profile.hideNameInGreeting ? 26 : 2
                  }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>

            {/* Остальные настройки */}
            {[
              { icon: Bell, label: 'уведомления', value: 'включены' },
              { icon: Shield, label: 'конфиденциальность', value: 'локально' },
              { icon: User, label: 'аккаунт', value: profile.name ? 'активен' : 'не настроен' },
              { icon: Info, label: 'о приложении', value: 'версия 2.0.0' }
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="px-5 py-4 flex items-center justify-between border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-red-600" />
                  <p className="text-black text-sm">{label}</p>
                </div>
                <p className="text-gray-500 text-xs">{value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Управление данными */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="px-4 mt-4"
        >
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Database className="w-6 h-6 text-red-600" />
              <h2 className="text-lg text-black text-center flex-1">управление данными</h2>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowExportDialog(true)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors text-base font-medium text-center flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                экспорт данных
              </button>

              <button
                onClick={() => setShowImportDialog(true)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors text-base font-medium text-center flex items-center justify-center gap-2"
              >
                <Upload className="w-5 h-5" />
                импорт данных
              </button>

              <button
                onClick={() => setShowBackupDialog(true)}
                className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors text-base font-medium text-center"
              >
                создать резервную копию
              </button>

              <button
                onClick={resetAllData}
                className="w-full bg-red-900 text-white py-3 rounded-xl hover:bg-red-800 transition-colors text-base font-medium text-center"
              >
                сбросить все данные
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Диалог экспорта */}
      <AnimatePresence>
        {showExportDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h2 className="text-xl text-black mb-4 text-center">экспорт данных</h2>
              
              <p className="text-gray-600 text-sm mb-6 leading-relaxed text-center">
                будут экспортированы:
                <br />• профиль и настройки
                <br />• накопленные фишки
                <br />• активированные промокоды
                <br />• история активностей
              </p>

              <div className="flex gap-3">
                <button
                  onClick={exportProfileData}
                  className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors text-base font-medium text-center"
                >
                  экспорт
                </button>
                <button
                  onClick={() => setShowExportDialog(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors text-base text-center"
                >
                  отмена
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Диалог импорта */}
      <AnimatePresence>
        {showImportDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h2 className="text-xl text-black mb-4 text-center">импорт данных</h2>
              
              <p className="text-gray-600 text-sm mb-6 leading-relaxed text-center">
                выберите файл с ранее экспортированными данными
              </p>

              <input
                type="file"
                accept=".json"
                onChange={importProfileData}
                className="w-full mb-4"
              />

              <button
                onClick={() => setShowImportDialog(false)}
                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors text-base text-center"
              >
                отмена
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Диалог бэкапа */}
      <AnimatePresence>
        {showBackupDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              {isCreatingBackup ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-black text-base text-center">создание резервной копии...</p>
                  <p className="text-gray-500 text-sm mt-2 text-center">это займет несколько секунд</p>
                </div>
              ) : (
                <>
                  <h2 className="text-xl text-black mb-4 text-center">создать резервную копию?</h2>
                  
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed text-center">
                    будут сохранены все данные приложения
                  </p>

                  <div className="flex gap-3">
                    <button
                      onClick={handleCreateBackup}
                      className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-colors text-base font-medium text-center"
                    >
                      начать
                    </button>
                    <button
                      onClick={() => setShowBackupDialog(false)}
                      className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition-colors text-base text-center"
                    >
                      отмена
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Диалог ошибки мата */}
      <ProfanityErrorDialog 
        show={showProfanityError} 
        onClose={() => setShowProfanityError(false)} 
      />
    </motion.div>
  );
}