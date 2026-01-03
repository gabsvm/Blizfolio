import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { foldersService } from '../services/folders.service';
import { Folder } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLanguageStore } from '../store/useLanguageStore';

const folderSchema = z.object({
  name: z.string().min(1, 'Name required'),
  category: z.string().min(1, 'Category required'),
  description: z.string(),
  status: z.enum(['Draft', 'Published']),
  coverImage: z.string().optional(),
});

type FolderFormValues = z.infer<typeof folderSchema>;

export const Folders: React.FC = () => {
  const { t } = useLanguageStore();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { register, handleSubmit, reset } = useForm<FolderFormValues>({
    resolver: zodResolver(folderSchema),
    defaultValues: { status: 'Draft' }
  });

  const loadFolders = async () => {
    setLoading(true);
    try {
      const data = await foldersService.getAll();
      setFolders(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFolders();
  }, []);

  const handleCreate = async (data: FolderFormValues) => {
    await foldersService.create({
      ...data,
      tags: [],
      coverImage: data.coverImage || `https://picsum.photos/400/300?random=${Date.now()}`
    });
    setIsModalOpen(false);
    reset();
    loadFolders();
  };

  const filteredFolders = folders.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('folders.title')}</h1>
          <p className="text-gray-500">{t('folders.subtitle')}</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>+ {t('folders.create')}</Button>
      </div>

      <div className="mb-6">
        <Input 
          placeholder={`🔍 ${t('folders.search')}`}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {loading ? (
        <div className="text-center py-10">{t('common.loading')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFolders.map(folder => (
            <Link key={folder.id} to={`/folders/${folder.id}`} className="group">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all">
                <div className="h-40 bg-gray-200 relative">
                  {folder.coverImage && (
                    <img src={folder.coverImage} alt={folder.name} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      folder.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {folder.status === 'Published' ? t('folders.status.published') : t('folders.status.draft')}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg group-hover:text-brand-600 transition-colors">{folder.name}</h3>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{folder.productCount} {t('folders.items')}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{folder.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded-full border border-brand-100">{folder.category}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t('folders.create')}>
        <form onSubmit={handleSubmit(handleCreate)} className="space-y-4">
          <Input label="Name" {...register('name')} />
          <Input label="Category" {...register('category')} />
          <Input label="Description" {...register('description')} />
          <Input label={t('folders.image')} {...register('coverImage')} placeholder="https://..." />
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Status</label>
            <select {...register('status')} className="border rounded p-2 dark:bg-gray-700">
              <option value="Draft">{t('folders.status.draft')}</option>
              <option value="Published">{t('folders.status.published')}</option>
            </select>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">{t('common.save')}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
