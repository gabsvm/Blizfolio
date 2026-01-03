import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { foldersService } from '../services/folders.service';
import { productsService } from '../services/products.service';
import { Folder, Product, ProductImage } from '../types';
import { Button } from '../components/ui/Button';
import { useLanguageStore } from '../store/useLanguageStore';
import { useToastStore } from '../store/useToastStore';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Product Schema
const productSchema = z.object({
  name: z.string().min(1, 'Name required'),
  sku: z.string().min(1, 'SKU required'),
  stock: z.number().min(0),
  basePrice: z.number().min(0),
  type: z.enum(['physical', 'service', 'digital']),
  shortDescription: z.string().optional(),
});
type ProductFormValues = z.infer<typeof productSchema>;

// Folder Edit Schema
const folderEditSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  coverImage: z.string().optional(),
});
type FolderEditValues = z.infer<typeof folderEditSchema>;


export const FolderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguageStore();
  const { addToast } = useToastStore();
  
  const [folder, setFolder] = useState<Folder | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // States for Filtering and Sorting
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock'>('name');
  const [filterType, setFilterType] = useState<string>('all');

  // Modal States
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditFolderModalOpen, setEditFolderModalOpen] = useState(false);
  
  // Image Management State (Local to modal)
  const [tempImages, setTempImages] = useState<ProductImage[]>([]);

  // Forms
  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { type: 'physical', stock: 0, basePrice: 0 }
  });

  const folderForm = useForm<FolderEditValues>({
    resolver: zodResolver(folderEditSchema)
  });

  const loadData = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const allFolders = await foldersService.getAll();
      const found = allFolders.find(f => f.id === id);
      if (found) {
        setFolder(found);
        folderForm.reset({ 
            name: found.name, 
            description: found.description,
            coverImage: found.coverImage 
        });
      }
      
      const folderProducts = await productsService.getByFolder(id);
      setProducts(folderProducts);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setTempImages(product.images || []);
      productForm.reset({
        name: product.name,
        sku: product.sku,
        stock: product.stock,
        basePrice: product.basePrice,
        type: product.type,
        shortDescription: product.shortDescription
      });
    } else {
      setEditingProduct(null);
      setTempImages([]);
      productForm.reset({ type: 'physical', stock: 0, basePrice: 0, name: '', sku: '' });
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (data: ProductFormValues) => {
    if (!id) return;
    try {
      const productData = {
        ...data,
        folderId: id,
        shortDescription: data.shortDescription || '',
        longDescription: '',
        minStockAlert: 5,
        variants: [],
        images: tempImages.length > 0 ? tempImages : [{ id: 'img-def', url: `https://picsum.photos/300/300?r=${Date.now()}`, isPrimary: true }],
      };

      if (editingProduct) {
        await productsService.update(editingProduct.id, productData);
        addToast(t('toast.productUpdated'), 'success');
      } else {
        await productsService.create(productData);
        addToast(t('toast.productCreated'), 'success');
      }
      
      setProductModalOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
      addToast(t('common.error'), 'error');
    }
  };

  const handleUpdateFolder = async (data: FolderEditValues) => {
    if (!id) return;
    try {
      await foldersService.update(id, data);
      addToast(t('toast.folderUpdated'), 'success');
      setEditFolderModalOpen(false);
      loadData();
    } catch (error) {
      console.error(error);
      addToast(t('common.error'), 'error');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if(window.confirm(t('common.confirm'))) {
        await productsService.delete(productId);
        addToast(t('toast.productDeleted'), 'success');
        loadData();
    }
  };

  // Image Helper Functions
  const addImage = () => {
    const url = window.prompt(t('product.addImage'), 'https://picsum.photos/300/300');
    if (url) {
      const newImg: ProductImage = {
        id: `img-${Date.now()}`,
        url,
        isPrimary: tempImages.length === 0, // First image is primary by default
      };
      setTempImages([...tempImages, newImg]);
    }
  };

  const removeImage = (imgId: string) => {
    setTempImages(tempImages.filter(img => img.id !== imgId));
  };

  const setPrimaryImage = (imgId: string) => {
    setTempImages(tempImages.map(img => ({
      ...img,
      isPrimary: img.id === imgId
    })));
  };

  // Filter & Sort Logic
  const getProcessedProducts = () => {
    let result = [...products];

    // Filter
    if (filterType !== 'all') {
      result = result.filter(p => p.type === filterType);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return a.basePrice - b.basePrice;
      if (sortBy === 'stock') return a.stock - b.stock;
      return 0;
    });

    return result;
  };

  const displayedProducts = getProcessedProducts();

  if (loading) return <div className="p-8">{t('common.loading')}</div>;
  if (!folder) return <div className="p-8">Folder not found</div>;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <button onClick={() => navigate('/folders')} className="hover:text-brand-600">{t('nav.folders')}</button>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-900 dark:text-gray-100">{folder.name}</span>
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center">
        <div className="flex items-center gap-4">
            <img src={folder.coverImage} className="w-16 h-16 rounded object-cover" alt="Cover" />
            <div>
                <h1 className="text-2xl font-bold">{folder.name}</h1>
                <p className="text-gray-500">{folder.category} • {folder.description}</p>
            </div>
        </div>
        <div className="mt-4 md:mt-0 flex gap-3">
            <Button variant="secondary" onClick={() => setEditFolderModalOpen(true)}>{t('details.editFolder')}</Button>
            <Button onClick={() => openProductModal()}>{t('details.addProduct')}</Button>
        </div>
      </div>

      {/* Toolbar (Filter & Sort) */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{t('filter.allTypes')}:</span>
            <select 
              className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-sm"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="physical">Physical</option>
              <option value="service">Service</option>
              <option value="digital">Digital</option>
            </select>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{t('sort.sortBy')}:</span>
            <select 
              className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 bg-white dark:bg-gray-800 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name">{t('sort.name')}</option>
              <option value="price">{t('sort.price')}</option>
              <option value="stock">{t('sort.stock')}</option>
            </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="font-semibold">{t('details.products')} ({displayedProducts.length})</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
              <tr>
                <th className="px-6 py-3 font-medium">{t('details.table.product')}</th>
                <th className="px-6 py-3 font-medium">{t('details.table.sku')}</th>
                <th className="px-6 py-3 font-medium">{t('details.table.stock')}</th>
                <th className="px-6 py-3 font-medium">{t('details.table.price')}</th>
                <th className="px-6 py-3 font-medium">{t('details.table.type')}</th>
                <th className="px-6 py-3 font-medium text-right">{t('details.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {displayedProducts.map(product => {
                const primaryImage = product.images?.find(i => i.isPrimary)?.url || product.images?.[0]?.url;
                return (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded flex-shrink-0">
                              {primaryImage && <img src={primaryImage} className="w-full h-full object-cover rounded" />}
                          </div>
                          <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[200px]">{product.shortDescription}</div>
                          </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{product.sku}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          product.stock <= product.minStockAlert ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                          {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">${product.basePrice.toFixed(2)}</td>
                    <td className="px-6 py-4 capitalize">{product.type}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-brand-600 hover:text-brand-800 mr-3" onClick={() => openProductModal(product)}>{t('details.edit')}</button>
                      <button className="text-red-600 hover:text-red-800" onClick={() => handleDeleteProduct(product.id)}>{t('details.delete')}</button>
                    </td>
                  </tr>
                );
              })}
              {displayedProducts.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        {t('details.empty')}
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal (Create/Edit) */}
      <Modal isOpen={isProductModalOpen} onClose={() => setProductModalOpen(false)} title={editingProduct ? t('details.editProduct') : t('details.addProduct')}>
        <form onSubmit={productForm.handleSubmit(handleSaveProduct)} className="space-y-4">
            <Input label="Name" {...productForm.register('name')} error={productForm.formState.errors.name?.message} />
            <Input label="SKU" {...productForm.register('sku')} error={productForm.formState.errors.sku?.message} />
            <div className="grid grid-cols-2 gap-4">
                <Input label="Price" type="number" step="0.01" {...productForm.register('basePrice', { valueAsNumber: true })} error={productForm.formState.errors.basePrice?.message} />
                <Input label="Stock" type="number" {...productForm.register('stock', { valueAsNumber: true })} error={productForm.formState.errors.stock?.message} />
            </div>
            <div className="flex flex-col">
                <label className="text-sm font-medium mb-1">Type</label>
                <select {...productForm.register('type')} className="border rounded p-2 dark:bg-gray-700">
                    <option value="physical">Physical</option>
                    <option value="service">Service</option>
                    <option value="digital">Digital</option>
                </select>
            </div>
            <Input label="Short Description" {...productForm.register('shortDescription')} />
            
            {/* Image Management */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">{t('product.images')}</label>
                <button type="button" onClick={addImage} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded hover:bg-gray-200">+ {t('product.addImage')}</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {tempImages.map(img => (
                  <div key={img.id} className={`relative group border rounded-lg overflow-hidden ${img.isPrimary ? 'ring-2 ring-brand-500' : ''}`}>
                    <img src={img.url} alt="Product" className="w-full h-20 object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center flex-col gap-1">
                      <button type="button" onClick={() => setPrimaryImage(img.id)} className="text-xs text-white bg-blue-600 px-2 py-0.5 rounded">★ {t('product.primary')}</button>
                      <button type="button" onClick={() => removeImage(img.id)} className="text-xs text-white bg-red-600 px-2 py-0.5 rounded">🗑 {t('product.remove')}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
                <Button type="submit">{t('common.save')}</Button>
            </div>
        </form>
      </Modal>

      {/* Edit Folder Modal */}
      <Modal isOpen={isEditFolderModalOpen} onClose={() => setEditFolderModalOpen(false)} title={t('details.editFolder')}>
        <form onSubmit={folderForm.handleSubmit(handleUpdateFolder)} className="space-y-4">
            <Input label="Name" {...folderForm.register('name')} />
            <Input label="Description" {...folderForm.register('description')} />
            <Input label={t('folders.image')} {...folderForm.register('coverImage')} placeholder="https://..." />
            <div className="flex justify-end pt-4">
                <Button type="submit">{t('common.save')}</Button>
            </div>
        </form>
      </Modal>

    </div>
  );
};
