'use client';

import React, { useState, useRef, useEffect } from 'react';

// ===== DROPDOWN INTERFACES =====

export interface DropdownItem {
  label: string;
  value: string;
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  className?: string;
  disabled?: boolean;
  closeOnItemClick?: boolean;
}

// ===== DROPDOWN COMPONENT =====
// Following team 13 dropdown patterns for consistent behavior

export default function Dropdown({
  trigger,
  items,
  placement = 'bottom-left',
  className = '',
  disabled = false,
  closeOnItemClick = true
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const placementClasses = {
    'bottom-left': 'top-full left-0 mt-2',
    'bottom-right': 'top-full right-0 mt-2',
    'top-left': 'bottom-full left-0 mb-2',
    'top-right': 'bottom-full right-0 mb-2'
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (item.disabled) return;

    if (item.onClick) {
      item.onClick();
    }

    if (closeOnItemClick) {
      setIsOpen(false);
    }
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative inline-block ${className}`}
    >
      {/* Trigger */}
      <div
        onClick={handleTriggerClick}
        className={`cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`
            absolute z-50 min-w-[180px] bg-white rounded-lg shadow-lg 
            border border-gray-200 py-2 ${placementClasses[placement]}
          `.trim()}
          role="menu"
        >
          {items.map((item, index) => (
            <button
              key={`${item.value}-${index}`}
              onClick={() => handleItemClick(item)}
              disabled={item.disabled}
              className={`
                w-full px-4 py-2 text-left text-sm transition-colors
                flex items-center space-x-3
                ${
                  item.disabled
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `.trim()}
              role="menuitem"
            >
              {item.icon && (
                <i className={`${item.icon} text-base`}></i>
              )}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ===== SELECT DROPDOWN COMPONENT =====
// Based on team 13 select dropdown patterns

export interface SelectDropdownProps {
  value?: string;
  placeholder?: string;
  options: DropdownItem[];
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export function SelectDropdown({
  value,
  placeholder = 'Select an option...',
  options,
  onChange,
  disabled = false,
  error,
  className = ''
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (selectedValue: string) => {
    if (onChange) {
      onChange(selectedValue);
    }
    setIsOpen(false);
  };

  const trigger = (
    <div
      className={`
        flex items-center justify-between px-4 py-3 bg-white border rounded-lg
        cursor-pointer transition-colors min-h-[48px]
        ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'}
        ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
        ${isOpen ? 'ring-2 ring-primary border-transparent' : ''}
        ${className}
      `.trim()}
    >
      <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
        {selectedOption ? selectedOption.label : placeholder}
      </span>
      <i className={`ri-arrow-down-s-line transition-transform ${isOpen ? 'rotate-180' : ''}`}></i>
    </div>
  );

  const dropdownItems: DropdownItem[] = options.map(option => ({
    ...option,
    onClick: () => handleSelect(option.value)
  }));

  return (
    <div className="space-y-1">
      <Dropdown
        trigger={trigger}
        items={dropdownItems}
        disabled={disabled}
        closeOnItemClick={true}
      />
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <i className="ri-error-warning-line mr-1"></i>
          {error}
        </p>
      )}
    </div>
  );
}

// ===== USER MENU DROPDOWN =====
// Following team 13 user menu patterns

export interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  menuItems: DropdownItem[];
  className?: string;
}

export function UserMenu({ user, menuItems, className = '' }: UserMenuProps) {
  const trigger = (
    <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover"
        />
      ) : (
        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
          {user.name.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="hidden md:block text-left">
        <p className="text-sm font-medium text-gray-900">{user.name}</p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
      <i className="ri-arrow-down-s-line text-gray-400"></i>
    </div>
  );

  return (
    <Dropdown
      trigger={trigger}
      items={menuItems}
      placement="bottom-right"
      className={className}
    />
  );
}
