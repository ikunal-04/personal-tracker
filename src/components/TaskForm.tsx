import React, { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { TaskFormData } from '../types';
import { Dialog } from '@headlessui/react';

interface TaskFormProps {
  onSubmit: (task: TaskFormData) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskForm({ onSubmit, isOpen, onClose }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    endDate: '',
    isDailyReset: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      endDate: '',
      isDailyReset: false,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="dialog-overlay" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="dialog-content">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-2xl font-bold text-gray-100">
              Add New Goal
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                Title
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isDailyReset"
                checked={formData.isDailyReset}
                onChange={(e) => setFormData({ ...formData, isDailyReset: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="isDailyReset" className="ml-2 block text-sm text-gray-300">
                Reset daily (task needs to be completed every day)
              </label>
            </div>

            <button type="submit" className="btn-primary w-full">
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Goal
            </button>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}