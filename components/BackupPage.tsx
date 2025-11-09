import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, Edit2, Download } from 'lucide-react';

interface BackupPageProps {
  onClose: () => void;
}

interface Backup {
  id: string;
  name: string;
  date: string;
  size: string;
}

export function BackupPage({ onClose }: BackupPageProps) {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('perecBackups');
    if (saved) {
      try {
        setBackups(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load backups');
      }
    }
  }, []);

  const saveBackups = (newBackups: Backup[]) => {
    setBackups(newBackups);
    localStorage.setItem('perecBackups', JSON.stringify(newBackups));
  };

  const handleDelete = (id: string) => {
    const newBackups = backups.filter(b => b.id !== id);
    saveBackups(newBackups);
    // Also delete the actual backup data
    localStorage.removeItem(`perecBackup_${id}`);
  };

  const handleRename = (id: string) => {
    if (editName.trim()) {
      const newBackups = backups.map(b => 
        b.id === id ? { ...b, name: editName.trim() } : b
      );
      saveBackups(newBackups);
      setEditingId(null);
      setEditName('');
    }
  };

  const startEdit = (backup: Backup) => {
    setEditingId(backup.id);
    setEditName(backup.name);
  };

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
          <h1 className="text-black" style={{ fontSize: '24px' }}>мои резервные копии</h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-red-50 transition-colors"
            style={{ borderRadius: '50%' }}
          >
            <X className="w-6 h-6 text-red-600" />
          </button>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="px-4 mt-6"
        >
          <div className="bg-red-600 text-white p-5 mb-6" style={{ borderRadius: '20px' }}>
            <h3 className="mb-2" style={{ fontSize: '16px' }}>о резервных копиях</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
              резервные копии созданы для сохранности ваших данных в условиях возможных перебоев со связью на территории кировской области.
              <br /><br />
              вы можете создать полное резервное копирование приложения, которое будет храниться локально на вашем устройстве.
              это позволит восстановить все данные в случае необходимости.
            </p>
          </div>
        </motion.div>

        {/* Backups List */}
        <div className="px-4">
          {backups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400" style={{ fontSize: '16px' }}>
                резервных копий пока нет
              </p>
              <p className="text-gray-400 mt-2" style={{ fontSize: '14px' }}>
                создайте копию в разделе "резервное копирование"
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {backups.map((backup, index) => (
                <motion.div
                  key={backup.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white border-2 border-red-600 p-4"
                  style={{ borderRadius: '15px' }}
                >
                  {editingId === backup.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 px-3 py-2 border-2 border-gray-300 focus:outline-none focus:border-red-600"
                        style={{ borderRadius: '10px', fontSize: '14px' }}
                        autoFocus
                      />
                      <button
                        onClick={() => handleRename(backup.id)}
                        className="px-4 py-2 bg-red-600 text-white"
                        style={{ borderRadius: '10px', fontSize: '14px' }}
                      >
                        ок
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-4 py-2 bg-gray-200 text-black"
                        style={{ borderRadius: '10px', fontSize: '14px' }}
                      >
                        отмена
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-black mb-1" style={{ fontSize: '16px' }}>
                            {backup.name}
                          </h3>
                          <p className="text-gray-600" style={{ fontSize: '12px' }}>
                            {backup.date}
                          </p>
                          <p className="text-gray-500 mt-1" style={{ fontSize: '11px' }}>
                            размер: {backup.size}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(backup)}
                            className="p-2 hover:bg-red-50 transition-colors"
                            style={{ borderRadius: '50%' }}
                          >
                            <Edit2 className="w-4 h-4 text-red-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(backup.id)}
                            className="p-2 hover:bg-red-50 transition-colors"
                            style={{ borderRadius: '50%' }}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
