'use client';

import React, { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout';
import { InputField, TextArea, SelectField, useFormValidation } from '../../components/ui/FormFields';
import Modal, { ConfirmModal } from '../../components/ui/Modal';
import Dropdown, { SelectDropdown, UserMenu } from '../../components/ui/Dropdown';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

// Demo page showcasing Phase 2.3 components following team 13 patterns
export default function ComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Form validation demo following team 13 form patterns
  const { values, errors, setValue, validateAll, reset } = useFormValidation(
    {
      name: '',
      email: '',
      message: '',
      category: ''
    },
    {
      name: { required: true, minLength: 2 },
      email: { required: true, email: true },
      message: { required: true, minLength: 10, maxLength: 500 },
      category: { required: true }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAll()) {
      setIsConfirmOpen(true);
    }
  };

  const categoryOptions = [
    { value: 'pottery', label: 'Pottery & Ceramics' },
    { value: 'jewelry', label: 'Handmade Jewelry' },
    { value: 'textiles', label: 'Textiles & Fabrics' },
    { value: 'woodwork', label: 'Woodworking' },
    { value: 'other', label: 'Other Crafts' }
  ];

  const dropdownItems = [
    { label: 'View Products', value: 'products', icon: 'ri-shopping-bag-line' },
    { label: 'Artisan Profile', value: 'profile', icon: 'ri-user-line' },
    { label: 'Order History', value: 'orders', icon: 'ri-history-line' },
    { label: 'Favorites', value: 'favorites', icon: 'ri-heart-line' },
    { label: 'Settings', value: 'settings', icon: 'ri-settings-line' },
    { label: 'Sign Out', value: 'logout', icon: 'ri-logout-box-line' }
  ];

  const mockUser = {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: undefined
  };

  return (
    <PageLayout 
      title="UI Components Demo"
      showBreadcrumbs={false}
      className="bg-gray-50"
    >
      <div className="space-y-12">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Phase 2.3: Base UI Components</h2>
          <p className="text-lg text-gray-600 mt-2">
            Form fields, modals, and dropdowns following team 13 design patterns
          </p>
        </div>

        {/* Form Components Section */}
        <section>
          <Card className="p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Form Components
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={values.name}
                  onChange={(e) => setValue('name', e.target.value)}
                  error={errors.name}
                  leftIcon="ri-user-line"
                  required
                />
                
                <InputField
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={values.email}
                  onChange={(e) => setValue('email', e.target.value)}
                  error={errors.email}
                  leftIcon="ri-mail-line"
                  required
                />
              </div>

              <SelectField
                label="Craft Category"
                placeholder="Select a category"
                options={categoryOptions}
                value={values.category}
                onChange={(e) => setValue('category', e.target.value)}
                error={errors.category}
                required
              />

              <TextArea
                label="Message"
                placeholder="Tell us about your craft or inquiry..."
                rows={4}
                maxLength={500}
                showCharCount
                value={values.message}
                onChange={(e) => setValue('message', e.target.value)}
                error={errors.message}
                required
              />

              <div className="flex space-x-4">
                <Button type="submit" variant="primary">
                  Submit Form
                </Button>
                <Button type="button" variant="secondary" onClick={reset}>
                  Reset Form
                </Button>
              </div>
            </form>
          </Card>
        </section>

        {/* Modal Components Section */}
        <section>
          <Card className="p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Modal Components
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button onClick={() => setIsModalOpen(true)}>
                  Open Modal
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={() => setIsConfirmOpen(true)}
                >
                  Confirm Dialog
                </Button>
              </div>

              <p className="text-gray-600">
                Modal components with overlay, escape key handling, and focus management
                following team 13 UX patterns.
              </p>
            </div>
          </Card>
        </section>

        {/* Dropdown Components Section */}
        <section>
          <Card className="p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Dropdown Components
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Dropdown */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Basic Dropdown</h4>
                <Dropdown
                  trigger={
                    <Button variant="secondary">
                      Actions <i className="ri-arrow-down-s-line ml-2"></i>
                    </Button>
                  }
                  items={dropdownItems.slice(0, 4)}
                />
              </div>

              {/* Select Dropdown */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Select Dropdown</h4>
                <SelectDropdown
                  placeholder="Choose category..."
                  options={categoryOptions}
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                />
              </div>

              {/* User Menu */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">User Menu</h4>
                <UserMenu
                  user={mockUser}
                  menuItems={dropdownItems}
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Component Variants Section */}
        <section>
          <Card className="p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              Component Variants
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Variants */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Input Field Variants</h4>
                
                <InputField
                  label="Default Input"
                  placeholder="Default variant"
                  variant="default"
                />
                
                <InputField
                  label="Filled Input" 
                  placeholder="Filled variant"
                  variant="filled"
                />
                
                <InputField
                  label="Outlined Input"
                  placeholder="Outlined variant" 
                  variant="outlined"
                />
                
                <InputField
                  label="With Icons"
                  placeholder="Search products..."
                  leftIcon="ri-search-line"
                  rightIcon="ri-close-line"
                />
              </div>

              {/* Size Variants */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Size Variants</h4>
                
                <InputField
                  label="Small Input"
                  placeholder="Small size"
                  size="sm"
                />
                
                <InputField
                  label="Medium Input"
                  placeholder="Medium size (default)"
                  size="md"
                />
                
                <InputField
                  label="Large Input"
                  placeholder="Large size"
                  size="lg"
                />
              </div>
            </div>
          </Card>
        </section>

        {/* Progress Status */}
        <section>
          <Card className="p-8 bg-gradient-to-r from-amber-50 to-orange-50">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Development Progress
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-amber-600 mb-2">✅ Phase 2.2: Layout Components</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Modern EJS templating system</li>
                  <li>• Breadcrumb navigation</li>
                  <li>• Loading states and error boundaries</li>
                  <li>• Page layout wrapper</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-amber-600 mb-2">✅ Phase 2.3: Base UI Components</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Form input components with validation</li>
                  <li>• Modal and confirmation dialogs</li>
                  <li>• Dropdown and select components</li>
                  <li>• Component variants and sizes</li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-white rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Next:</strong> Phase 3.1 - Homepage Implementation with hero section development
              </p>
            </div>
          </Card>
        </section>
      </div>

      {/* Demo Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Example Modal"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This is an example modal following team 13 design patterns. It includes:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li>Overlay with click-to-close functionality</li>
            <li>Escape key handling</li>
            <li>Focus management and accessibility</li>
            <li>Smooth animations and transitions</li>
          </ul>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>
              Understood
            </Button>
          </div>
        </div>
      </Modal>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          alert('Form submitted successfully!');
          reset();
        }}
        title="Submit Form"
        message="Are you sure you want to submit this form? This action cannot be undone."
        confirmText="Submit"
        cancelText="Cancel"
        variant="default"
      />
    </PageLayout>
  );
}
