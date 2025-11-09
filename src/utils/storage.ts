// utils/storage.ts

// Прокси для localStorage с резервным копированием
export class PersistentStorage {
  private static instance: PersistentStorage;
  private storage: { [key: string]: any } = {};
  private isInitialized = false;
  private pendingBackups = new Set<string>();

  private constructor() {
    this.init();
  }

  static getInstance(): PersistentStorage {
    if (!PersistentStorage.instance) {
      PersistentStorage.instance = new PersistentStorage();
    }
    return PersistentStorage.instance;
  }

  private init() {
    // Восстанавливаем данные из localStorage
    this.restoreFromLocalStorage();
    
    // Слушаем сообщения от родительского окна
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleParentMessage.bind(this));
      
      // Сообщаем родителю о готовности
      this.notifyParent('STORAGE_READY');
      
      // Запрашиваем восстановление данных
      setTimeout(() => {
        this.notifyParent('REQUEST_RESTORE');
      }, 1000);
    }

    this.isInitialized = true;
  }

  private handleParentMessage(event: MessageEvent) {
    const { type, data } = event.data;

    switch (type) {
      case 'RESTORE_BACKUP':
        // Восстанавливаем данные от родителя
        this.restoreFromBackup(data);
        break;
        
      case 'REQUEST_BACKUP':
        // Родитель запрашивает бэкап
        this.sendBackupToParent();
        break;
    }
  }

  private notifyParent(type: string, data?: any) {
    if (typeof window !== 'undefined' && window.parent !== window) {
      try {
        window.parent.postMessage({
          type,
          data
        }, '*');
      } catch (e) {
        console.warn('Parent notification failed:', e);
      }
    }
  }

  private restoreFromLocalStorage() {
    try {
      // Восстанавливаем из локального localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          try {
            const value = localStorage.getItem(key);
            if (value) {
              this.storage[key] = JSON.parse(value);
            }
          } catch (e) {
            // Игнорируем невалидные данные
          }
        }
      }
    } catch (e) {
      console.warn('LocalStorage restore failed:', e);
    }
  }

  private restoreFromBackup(backupData: { [key: string]: any }) {
    if (!backupData) return;

    try {
      // Восстанавливаем данные из бэкапа
      for (const [key, value] of Object.entries(backupData)) {
        this.storage[key] = value;
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
          console.warn(`Failed to save ${key} to localStorage:`, e);
        }
      }
      console.log('Restored from backup:', Object.keys(backupData).length, 'items');
    } catch (e) {
      console.error('Backup restore failed:', e);
    }
  }

  sendBackupToParent() {
    if (typeof window !== 'undefined') {
      try {
        // Собираем все данные для бэкапа
        const backupData: { [key: string]: any } = {};
        
        // Из memory storage
        Object.assign(backupData, this.storage);
        
        // Из localStorage
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && !key.startsWith('_')) { // Исключаем системные ключи
            try {
              const value = localStorage.getItem(key);
              if (value) {
                backupData[key] = JSON.parse(value);
              }
            } catch (e) {
              // Пропускаем невалидные данные
            }
          }
        }

        this.notifyParent('BACKUP_DATA', backupData);
        this.pendingBackups.clear();
        
      } catch (e) {
        console.error('Backup creation failed:', e);
      }
    }
  }

  // Public API
  setItem(key: string, value: any): void {
    try {
      this.storage[key] = value;
      localStorage.setItem(key, JSON.stringify(value));
      
      // Помечаем для следующего бэкапа
      this.pendingBackups.add(key);
      
      // Автоматический бэкап при важных изменениях
      if (key.includes('cart') || key.includes('order') || key.includes('user')) {
        setTimeout(() => this.sendBackupToParent(), 100);
      }
      
    } catch (e) {
      console.warn(`Failed to set ${key}:`, e);
    }
  }

  getItem<T = any>(key: string): T | null {
    // Сначала проверяем memory storage
    if (key in this.storage) {
      return this.storage[key] as T;
    }
    
    // Затем проверяем localStorage
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const value = JSON.parse(item);
        this.storage[key] = value; // Кэшируем
        return value as T;
      }
    } catch (e) {
      console.warn(`Failed to get ${key}:`, e);
    }
    
    return null;
  }

  removeItem(key: string): void {
    try {
      delete this.storage[key];
      localStorage.removeItem(key);
      this.pendingBackups.add(key);
    } catch (e) {
      console.warn(`Failed to remove ${key}:`, e);
    }
  }

  clear(): void {
    try {
      this.storage = {};
      localStorage.clear();
      this.notifyParent('BACKUP_DATA', {});
    } catch (e) {
      console.warn('Failed to clear storage:', e);
    }
  }
}

// Экспорт синглтона
export const persistentStorage = PersistentStorage.getInstance();

// Хук для React компонентов
export const usePersistentStorage = () => {
  return persistentStorage;
};