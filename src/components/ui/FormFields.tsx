'use client';

import React, { useState, forwardRef } from 'react';

// ===== INPUT FIELD INTERFACES =====

export interface InputFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: string;
  rightIcon?: string;
  onRightIconClick?: () => void;
  required?: boolean;
}

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'maxLength'> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  resize?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  required?: boolean;
}

export interface SelectFieldProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
  placeholder?: string;
  variant?: 'default' | 'filled' | 'outlined';
  required?: boolean;
}

// ===== INPUT FIELD COMPONENT =====

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  size = 'md',
  leftIcon,
  rightIcon,
  onRightIconClick,
  required = false,
  className = '',
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-4 py-4 text-base'
  };

  const variantClasses = {
    default: 'border border-gray-300 bg-white',
    filled: 'border-0 bg-gray-100',
    outlined: 'border-2 border-gray-300 bg-white'
  };

  const focusClasses = error
    ? 'focus:ring-2 focus:ring-red-500 focus:border-red-500'
    : 'focus:ring-2 focus:ring-primary focus:border-transparent';

  const errorClasses = error
    ? 'border-red-300 bg-red-50'
    : '';

  const inputClasses = `
    w-full rounded-lg transition-all duration-200
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${focusClasses}
    ${errorClasses}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className={`${leftIcon} text-gray-400`}></i>
          </div>
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        
        {rightIcon && (
          <div 
            className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
              onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'
            }`}
            onClick={onRightIconClick}
          >
            <i className={`${rightIcon} text-gray-400 hover:text-gray-600`}></i>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <i className="ri-error-warning-line mr-1"></i>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

// ===== TEXTAREA COMPONENT =====

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  helperText,
  variant = 'default',
  resize = false,
  maxLength,
  showCharCount = false,
  required = false,
  className = '',
  value,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);

  const variantClasses = {
    default: 'border border-gray-300 bg-white',
    filled: 'border-0 bg-gray-100',
    outlined: 'border-2 border-gray-300 bg-white'
  };

  const focusClasses = error
    ? 'focus:ring-2 focus:ring-red-500 focus:border-red-500'
    : 'focus:ring-2 focus:ring-primary focus:border-transparent';

  const errorClasses = error
    ? 'border-red-300 bg-red-50'
    : '';

  const textareaClasses = `
    w-full px-4 py-3 text-sm rounded-lg transition-all duration-200
    ${variantClasses[variant]}
    ${focusClasses}
    ${errorClasses}
    ${resize ? 'resize-y' : 'resize-none'}
    ${className}
  `.trim();

  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        className={textareaClasses}
        maxLength={maxLength}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      
      <div className="flex justify-between items-center">
        <div>
          {error && (
            <p className="text-sm text-red-600 flex items-center">
              <i className="ri-error-warning-line mr-1"></i>
              {error}
            </p>
          )}
          
          {helperText && !error && (
            <p className="text-sm text-gray-500">{helperText}</p>
          )}
        </div>
        
        {showCharCount && maxLength && (
          <p className={`text-sm ${
            currentLength > maxLength * 0.9 ? 'text-amber-600' : 'text-gray-500'
          }`}>
            {currentLength}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

TextArea.displayName = 'TextArea';

// ===== SELECT FIELD COMPONENT =====

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(({
  label,
  error,
  helperText,
  options,
  placeholder,
  variant = 'default',
  required = false,
  className = '',
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);

  const variantClasses = {
    default: 'border border-gray-300 bg-white',
    filled: 'border-0 bg-gray-100',
    outlined: 'border-2 border-gray-300 bg-white'
  };

  const focusClasses = error
    ? 'focus:ring-2 focus:ring-red-500 focus:border-red-500'
    : 'focus:ring-2 focus:ring-primary focus:border-transparent';

  const errorClasses = error
    ? 'border-red-300 bg-red-50'
    : '';

  const selectClasses = `
    w-full px-4 py-3 pr-10 text-sm rounded-lg transition-all duration-200
    appearance-none cursor-pointer
    ${variantClasses[variant]}
    ${focusClasses}
    ${errorClasses}
    ${className}
  `.trim();

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          className={selectClasses}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <i className="ri-arrow-down-s-line text-gray-400"></i>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <i className="ri-error-warning-line mr-1"></i>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

SelectField.displayName = 'SelectField';

// ===== FORM VALIDATION HOOK =====

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  email?: boolean;
  phone?: boolean;
  custom?: (value: any) => string | null;
}

export interface FormValidation {
  [key: string]: ValidationRule;
}

export function useFormValidation<T extends Record<string, any>>(
  initialValues: T,
  validation: FormValidation
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouchedState] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = (name: keyof T, value: any): string | null => {
    const rules = validation[name as string];
    if (!rules) return null;

    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return 'This field is required';
    }

    if (value && typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `Must be at least ${rules.minLength} characters`;
      }

      if (rules.maxLength && value.length > rules.maxLength) {
        return `Must be no more than ${rules.maxLength} characters`;
      }

      if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Please enter a valid email address';
      }

      if (rules.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, ''))) {
        return 'Please enter a valid phone number';
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return 'Please enter a valid format';
      }
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  };

  const setValue = (name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validate on change
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error || undefined }));
  };

  const setTouched = (name: keyof T) => {
    setTouchedState(prev => ({ ...prev, [name]: true }));
  };

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validation).forEach(key => {
      const error = validateField(key as keyof T, values[key as keyof T]);
      if (error) {
        newErrors[key as keyof T] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouchedState({});
  };

  return {
    values,
    errors,
    touched,
    setValue,
    setTouched,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  };
}
