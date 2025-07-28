'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

// ===== MODAL INTERFACES =====

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  children: React.ReactNode;
  className?: string;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  align?: 'start' | 'center' | 'end';
  className?: string;
  menuClassName?: string;
  disabled?: boolean;
}

export interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  icon?: string;
  className?: string;
  destructive?: boolean;
}

// ===== MODAL COMPONENT =====

export function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  children,
  className = ''
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  const handleOverlayClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose();
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className={`
          relative bg-white rounded-2xl shadow-2xl w-full
          ${sizeClasses[size]}
          ${className}
          transform transition-all duration-300 ease-out
          max-h-[90vh] overflow-hidden
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
            )}
          </div>
        )}

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

// ===== MODAL COMPONENTS =====

export function ModalHeader({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function ModalBody({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 ${className}`}>
      {children}
    </div>
  );
}

// ===== DROPDOWN COMPONENT =====

export function Dropdown({
  trigger,
  children,
  position = 'bottom-left',
  align = 'start',
  className = '',
  menuClassName = '',
  disabled = false
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const positionClasses = {
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2'
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={handleTriggerClick} className={disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}>
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className={`
            absolute z-50 min-w-48 bg-white rounded-lg shadow-lg border border-gray-200
            ${positionClasses[position]}
            ${menuClassName}
            transform transition-all duration-200 ease-out
            opacity-100 scale-100
          `}
          style={{
            transformOrigin: position.includes('top') ? 'bottom' : 'top'
          }}
        >
          <div className="py-1">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

// ===== DROPDOWN ITEM COMPONENT =====

export function DropdownItem({
  children,
  onClick,
  href,
  disabled = false,
  icon,
  className = '',
  destructive = false
}: DropdownItemProps) {
  const baseClasses = `
    w-full px-4 py-2 text-left text-sm transition-colors duration-150
    flex items-center
    ${destructive ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  if (href && !disabled) {
    return (
      <a href={href} className={baseClasses}>
        {icon && <i className={`${icon} mr-2`}></i>}
        {children}
      </a>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={baseClasses}
    >
      {icon && <i className={`${icon} mr-2`}></i>}
      {children}
    </button>
  );
}

// ===== DROPDOWN DIVIDER =====

export function DropdownDivider({ className = '' }: { className?: string }) {
  return <hr className={`border-gray-200 my-1 ${className}`} />;
}

// ===== CONFIRMATION MODAL =====

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  isLoading = false
}: ConfirmationModalProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  const confirmButtonClass = variant === 'danger'
    ? 'bg-red-600 hover:bg-red-700 text-white'
    : 'bg-primary hover:bg-primary-dark text-white';

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" title={title}>
      <ModalBody>
        <p className="text-gray-600">{message}</p>
      </ModalBody>
      <ModalFooter>
        <button
          onClick={onClose}
          disabled={isLoading}
          className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${confirmButtonClass}`}
        >
          {isLoading ? (
            <>
              <i className="ri-loader-2-line animate-spin mr-2"></i>
              Loading...
            </>
          ) : (
            confirmText
          )}
        </button>
      </ModalFooter>
    </Modal>
  );
}

// ===== CUSTOM HOOKS =====

export function useModal(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    open,
    close,
    toggle
  };
}

export function useDropdown(initialState = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen(prev => !prev);

  return {
    isOpen,
    open,
    close,
    toggle
  };
}
