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

interface PortfolioImage {
  url: string;
  publicId: string;
}

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  clientType: string;
  location: string;
  servicesDelivered: string[];
  completionDate: string;
  featured: boolean;
  images: PortfolioImage[];
}

interface FormData {
  title: string;
  description: string;
  clientType: string;
  location: string;
  servicesDelivered: string;
  completionDate: string;
  featured: boolean;
  images: PortfolioImage[];
}

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<PortfolioProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<PortfolioProject | null>(null);
  const [deletingProject, setDeletingProject] = useState<PortfolioProject | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    clientType: 'Individual',
    location: '',
    servicesDelivered: '',
    completionDate: '',
    featured: false,
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredProjects(
        projects.filter(project =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.clientType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.location?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProjects(projects);
    }
  }, [searchTerm, projects]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
      toast.error('Failed to load portfolio projects');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      clientType: 'Individual',
      location: '',
      servicesDelivered: '',
      completionDate: '',
      featured: false,
      images: [],
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (project: PortfolioProject) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      clientType: project.clientType,
      location: project.location,
      servicesDelivered: project.servicesDelivered.join(', '),
      completionDate: project.completionDate.split('T')[0],
      featured: project.featured,
      images: project.images,
    });
    setIsFormModalOpen(true);
  };

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setEditingProject(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'portfolio');

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
        clientType: formData.clientType,
        location: formData.location,
        servicesDelivered: formData.servicesDelivered.split(',').map(s => s.trim()).filter(s => s),
        completionDate: new Date(formData.completionDate).toISOString(),
        featured: formData.featured,
        images: formData.images,
      };

      const url = editingProject ? `/api/portfolio/${editingProject.id}` : '/api/portfolio';
      const method = editingProject ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success(`Project ${editingProject ? 'updated' : 'created'} successfully`);
        handleCloseFormModal();
        fetchProjects();
      } else {
        toast.error(`Failed to ${editingProject ? 'update' : 'create'} project`);
      }
    } catch (error) {
      console.error('Failed to save project:', error);
      toast.error(`Failed to ${editingProject ? 'update' : 'create'} project`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenDeleteDialog = (project: PortfolioProject) => {
    setDeletingProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingProject(null);
  };

  const handleDelete = async () => {
    if (!deletingProject) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/portfolio/${deletingProject.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Project deleted successfully');
        handleCloseDeleteDialog();
        fetchProjects();
      } else {
        toast.error('Failed to delete project');
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">Portfolio Projects</h1>
          <p className="text-gray-400">Manage your portfolio showcase</p>
        </div>
        <Button onClick={handleOpenAddModal}>
          <Plus className="mr-2" size={20} />
          Add New Project
        </Button>
      </div>

      <Card className="p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search projects..."
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
      ) : filteredProjects.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-400 text-lg">
            {searchTerm ? 'No projects found matching your search.' : 'No portfolio projects yet. Create your first project!'}
          </p>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden">
                <div className="relative h-48">
                  {project.images && project.images.length > 0 ? (
                    <Image
                      src={project.images[0].url}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  {project.featured && (
                    <div className="absolute top-3 right-3 bg-gold text-primary px-2 py-1 rounded text-xs font-bold">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-white mb-2 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gold text-sm">{project.clientType}</span>
                    {project.location && (
                      <span className="text-xs text-gray-500">{project.location}</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleOpenEditModal(project)}
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleOpenDeleteDialog(project)}
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
        title={editingProject ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Project Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <Textarea
            label="Project Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            required
          />

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Client Type
              </label>
              <select
                value={formData.clientType}
                onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                className="w-full px-4 py-3 bg-primary-light border border-gold/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-gold"
              >
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
              </select>
            </div>

            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Kaduna, Nigeria"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Completion Date"
              type="date"
              value={formData.completionDate}
              onChange={(e) => setFormData({ ...formData, completionDate: e.target.value })}
              required
            />

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-gold/30 bg-primary-light text-gold focus:ring-gold focus:ring-offset-0"
                />
                <span className="text-sm text-gray-200">Featured Project</span>
              </label>
            </div>
          </div>

          <Textarea
            label="Services Delivered (comma-separated)"
            value={formData.servicesDelivered}
            onChange={(e) => setFormData({ ...formData, servicesDelivered: e.target.value })}
            placeholder="Interior Design, Furniture Supply, Installation"
            rows={2}
            required
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
              {editingProject ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDelete}
        title="Delete Portfolio Project"
        message={`Are you sure you want to delete "${deletingProject?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
}
