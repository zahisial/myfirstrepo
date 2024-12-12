import React from 'react';
import { cn } from "../lib/utils";
import { useTranslation } from 'react-i18next';  // Import the useTranslation hook

interface SegmentOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  detail?: string;
}

interface SegmentedControlProps {
  options: SegmentOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: 'text' | 'icon' | 'textWithDetail' | 'primaryText';
  theme?: 'light' | 'dark';
}

export function SegmentedControl({
  options,
  value,
  onChange,
  className,
  type = 'text',
  theme = 'dark'
}: SegmentedControlProps) {
  const { t } = useTranslation();  // Initialize the translation hook

  return (
    <div className={cn(
      "inline-flex rounded-lg p-0.5 relative",
      theme === 'light' ? "bg-gray-100" : "bg-gray-800",
      className
    )}>
      {options.map((option) => (
        <button
          key={option.value}
          className={cn(
            "px-2 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap relative z-10",
            value === option.value
              ? theme === 'light'
                ? "text-gray-900"
                : "text-gray-100"
              : theme === 'light'
                ? "text-gray-500 hover:text-gray-900"
                : "text-gray-400 hover:text-gray-100",
            type === 'primaryText' && value === option.value && 
              theme === 'light' ? "text-indigo-600" : "text-indigo-100"
          )}
          onClick={() => onChange(option.value)}
        >
          {type === 'icon' && option.icon}
          {(type === 'text' || type === 'primaryText') && (
            <span className="block truncate">{t(option.label)}</span>  // Translate label
          )}
          {type === 'textWithDetail' && (
            <div className="flex flex-col items-center">
              <span className="block truncate">{t(option.label)}</span>  //// Translate label

              <span className="text-[8px] block truncate">{t(option.detail || '')}</span>  //// Translate detail

              <span className="text-[8px] block truncate">{option.detail ? t(option.detail) : ''}</span>  //// Translate detail

            </div>
          )}
        </button>
      ))}
      <div
        className={cn(
          "absolute top-0.5 bottom-0.5 transition-all duration-200 ease-out rounded-md",
          theme === 'light' ? "bg-white shadow-sm" : "bg-gray-700 shadow-sm",
          type === 'primaryText' && theme === 'light' ? "bg-indigo-600" : "bg-indigo-500"
        )}
        style={{
          left: `${(options.findIndex(opt => opt.value === value) / options.length) * 100}%`,
          width: `${100 / options.length}%`
        }}
      />
    </div>
  );
}