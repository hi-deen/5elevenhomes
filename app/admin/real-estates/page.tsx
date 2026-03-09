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
import toast from 'react-hot-toast';

interface RealEstateSection {
  id: string;
  sectionName: string;
  description: string;
  completedWorks: string[];
  ongoingWorks: string[];
  progressPercentage: number;
  status: string;
  images: string[];
  imagePublicIds: string[];
  order: number;
}

interface FormData {
  sectionName: string;
  description: string;
  completedWorks: string;
  ongoingWorks: string;
  progressPercentage: string;
  status: string;
  order: string;
  images: string[];
  imagePublicIds: string[];
}

export default function AdminRealEstatesPage() {
  const [sections, setSections] = useState<RealEstateSection[]>([]);
  const [filteredSections, setFilteredSections] = useState<RealEstateSection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<RealEstateSection | null>(null);
  const [deletingSection, setDeletingSection] = useState<RealEstateSection | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    sectionName: '',
    description: '',
    completedWorks: '',
    ongoingWorks: '',
    progressPercentage: '0',
    status: 'Planning',
    order: '0',
    images: [],
    imagePublicIds: [],
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchSections();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredSections(
        sections.filter(section =>
          section.sectionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          section.status.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredSections(sections);
    }
  }, [searchTerm, sections]);

  const fetchSections = async () => {
    try {
      const response = await fetch('/api/real-estates');
      if (response.ok) {
        const data = await response.json();
        setSections(data);
      }
    } catch (error) {
      console.error('Failed to fetch sections:', error);
      toast.error('Failed to load real estate sections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingSection(null);
    setFormData({
      sectionName: '',
      description: '',
      completedWorks: '',
      ongoingWorks: '',
      progressPercentage: '0',
      status: 'Planning',
      order: '0',
      images: [],
      imagePublicIds: [],
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (section: RealEstateSection) => {
    setEditingSection(section);
    setFormData({
      sectionName: section.sectionName,
      description: section.description,
      completedWorks: section.completedWorks.join(', '),
      ongoingWorks: section.ongoingWorks.join(', '),
      progressPercentage: section.progressPercentage.toString(),
      status: section.status,
      order: section.order.toString(),
      images: section.images,
      imagePublicIds: section.imagePublicIds,
    });
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingSection(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'real-estates');

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
        images: [...prev.images, ...uploadedImages.map((img: any) => img.url)],
        imagePublicIds: [...prev.imagePublicIds, ...uploadedImages.map((img: any) => img.publicId)],
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
      imagePublicIds: prev.imagePublicIds.filter((_, i) => i !== index),
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
        sectionName: formData.sectionName,
        description: formData.description,
        completedWorks: formData.completedWorks.split(',').map(s => s.trim()).filter(s => s),
        ongoingWorks: formData.ongoingWorks.split(',').map(s => s.trim()).filter(s => s),
        progressPercentage: parseInt(formData.progressPercentage),
        status: formData.status,
        order: parseInt(formData.order),
        images: formData.images,
        imagePublicIds: formData.imagePublicIds,
      };

      const url = editingSection ? `/api/real-estates/${editingSection.id}` : '/api/real-estates';
      const method = editingSection ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(`Section ${editingSection ? 'updated' : 'created'} successfully`);
        handleCloseFormModal();
        fetchSections();
      } else {
        toast.error(`Failed to ${editingSection ? 'update' : 'create'} section`);
      }
    } catch (error) {
      console.error('Failed to save section:', error);
      toast.error(`Failed to ${editingSection ? 'update' : 'create'} section`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDeleteDialog = (section: RealEstateSection) => {
    setDeletingSection(section);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingSection(null);
  };

  const handleDelete = async () => {
    if (!deletingSection) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/real-estates/${deletingSection.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Section deleted successfully');
        handleCloseDeleteDialog();
        fetchSections();
      } else {
        toast.error('Failed to delete section');
      }
    } catch (error) {
      console.error('Failed to delete section:', error);
      toast.error('Failed to delete section');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500/20 text-green-400';
      case 'Ongoing':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">Real Estate Sections</h1>
          <p className="text-gray-400">Manage your real estate projects</p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus className="mr-2" size={20} />
          Add New Section
        </Button>
      </div>

      <Card className="p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search sections..."
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
      ) : filteredSections.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-400 text-lg">
            {searchTerm ? 'No sections found matching your search.' : 'No real estate sections yet. Create your first section!'}
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSections.map((section, index) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden">
                <div className="relative h-48">
                  {section.images && section.images.length > 0 ? (
                    <Image
                      src={section.images[0]}
                      alt={section.sectionName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className={`absolute top-3 right-3 px-2 py-1 rounded text-xs font-bold ${getStatusColor(section.status)}`}>
                    {section.status}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                    {section.sectionName}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {section.description}
                  </p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">Progress</span>
                      <span className="text-gold">{section.progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-primary h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gold transition-all duration-300"
                        style={{ width: `${section.progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleOpenEditModal(section)}
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleOpenDeleteDialog(section)}
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
        title={editingSection ? 'Edit Real Estate Section' : 'Add New Real Estate Section'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Section Name"
            value={formData.sectionName}
            onChange={(e) => setFormData({ ...formData, sectionName: e.target.value })}
            placeholder="e.g., Section A, Phase 1"
            required
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            required
          />

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 bg-primary-light border border-gold/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="Planning">Planning</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <Input
              label="Progress %"
              type="number"
              min="0"
              max="100"
              value={formData.progressPercentage}
              onChange={(e) => setFormData({ ...formData, progressPercentage: e.target.value })}
              required
            />

            <Input
              label="Display Order"
              type="number"
              min="0"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: e.target.value })}
              required
            />
          </div>

          <Textarea
            label="Completed Works (comma-separated)"
            value={formData.completedWorks}
            onChange={(e) => setFormData({ ...formData, completedWorks: e.target.value })}
            placeholder="Foundation, Roofing, Plumbing"
            rows={2}
          />

          <Textarea
            label="Ongoing Works (comma-separated)"
            value={formData.ongoingWorks}
            onChange={(e) => setFormData({ ...formData, ongoingWorks: e.target.value })}
            placeholder="Electrical, Painting, Landscaping"
            rows={2}
          />

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
                      src={image}
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
              {editingSection ? 'Update' : 'Create'} Section
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Real Estate Section"
        message={`Are you sure you want to delete "${deletingSection?.sectionName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
