'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Plus, Edit, Trash2, Search, Upload, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ShowroomImage {
  url: string;
  publicId: string;
}

interface ShowroomItem {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  price: number;
  category: string;
  availability: string;
  specifications?: any;
  featured: boolean;
  images: ShowroomImage[];
}

interface FormData {
  title: string;
  description: string;
  fullDescription: string;
  price: string;
  category: string;
  availability: string;
  featured: boolean;
  images: ShowroomImage[];
}

export default function AdminShowroomPage() {
  const [items, setItems] = useState<ShowroomItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ShowroomItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ShowroomItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<ShowroomItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    fullDescription: '',
    price: '',
    category: '',
    availability: 'Available',
    featured: false,
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredItems(
        items.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredItems(items);
    }
  }, [searchTerm, items]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/showroom');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
      toast.error('Failed to load showroom items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      fullDescription: '',
      price: '',
      category: '',
      availability: 'Available',
      featured: false,
      images: [],
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (item: ShowroomItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      fullDescription: item.fullDescription,
      price: item.price.toString(),
      category: item.category,
      availability: item.availability,
      featured: item.featured,
      images: item.images,
    });
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      fullDescription: '',
      price: '',
      category: '',
      availability: 'Available',
      featured: false,
      images: [],
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'showroom');

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Upload failed');
        return await response.json();
      });

      const uploadedImages = await Promise.all(uploadPromises);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
      toast.success(`${uploadedImages.length} image(s) uploaded successfully`);
    } catch (error) {
      console.error('Failed to upload images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        fullDescription: formData.fullDescription,
        price: parseFloat(formData.price),
        category: formData.category,
        availability: formData.availability,
        featured: formData.featured,
        images: formData.images,
      };

      const url = editingItem ? `/api/showroom/${editingItem.id}` : '/api/showroom';
      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(`Item ${editingItem ? 'updated' : 'created'} successfully`);
        handleCloseFormModal();
        fetchItems();
      } else {
        toast.error(`Failed to ${editingItem ? 'update' : 'create'} item`);
      }
    } catch (error) {
      console.error('Failed to save item:', error);
      toast.error(`Failed to ${editingItem ? 'update' : 'create'} item`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDeleteDialog = (item: ShowroomItem) => {
    setDeletingItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingItem(null);
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/showroom/${deletingItem.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Item deleted successfully');
        handleCloseDeleteDialog();
        fetchItems();
      } else {
        toast.error('Failed to delete item');
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">Showroom Items</h1>
          <p className="text-gray-400">Manage your showroom inventory</p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus className="mr-2" size={20} />
          Add New Item
        </Button>
      </div>

      <Card className="p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-primary-light border border-gold/30 rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </Card>

      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredItems.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-400 text-lg">
            {searchTerm ? 'No items found matching your search.' : 'No showroom items yet. Create your first item!'}
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden">
                <div className="relative h-48">
                  {item.images && item.images.length > 0 ? (
                    <Image
                      src={item.images[0].url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  {item.featured && (
                    <div className="absolute top-3 right-3 bg-gold text-primary px-2 py-1 rounded text-xs font-bold">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gold font-bold">{formatPrice(item.price)}</span>
                    <span className="text-xs px-2 py-1 bg-gold/20 text-gold rounded">
                      {item.availability}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleOpenEditModal(item)}
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleOpenDeleteDialog(item)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        title={editingItem ? 'Edit Showroom Item' : 'Add New Showroom Item'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <Input
              label="Price (₦)"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>

          <Input
            label="Category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            placeholder="e.g., Furniture, Lighting, Decor"
            required
          />

          <Textarea
            label="Short Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            required
          />

          <Textarea
            label="Full Description"
            value={formData.fullDescription}
            onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
            rows={4}
            required
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Availability
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full px-4 py-3 bg-primary-light border border-gold/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="Available">Available</option>
                <option value="Sold">Sold</option>
                <option value="Reserved">Reserved</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-gold/30 bg-primary-light text-gold focus:ring-gold focus:ring-offset-0"
                />
                <span className="text-sm text-gray-200">Featured Item</span>
              </label>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Images
            </label>
            <div className="border-2 border-dashed border-gold/30 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <Upload className="mx-auto text-gold mb-2" size={32} />
                <p className="text-gray-300 mb-1">
                  {uploading ? 'Uploading...' : 'Click to upload images'}
                </p>
                <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
              </label>
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={image.url}
                      alt={`Upload ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-gold/20">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseFormModal}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving} disabled={isSaving || uploading}>
              {editingItem ? 'Update' : 'Create'} Item
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Showroom Item"
        message={`Are you sure you want to delete "${deletingItem?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
