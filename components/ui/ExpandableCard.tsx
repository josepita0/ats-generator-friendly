'use client';

import { useId, ReactNode } from 'react';

interface ExpandableCardProps {
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  children: ReactNode;
}

export function ExpandableCard({
  title,
  subtitle,
  icon = 'work',
  badge,
  isExpanded = false,
  onToggle,
  onDelete,
  onMoveUp,
  onMoveDown,
  children,
}: ExpandableCardProps) {
  const id = useId();

  return (
    <div
      className={`
        card
        transition-all duration-300
        ${isExpanded ? 'shadow-card' : 'hover:shadow-card-hover'}
      `}
    >
      {/* Header */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        aria-controls={`expandable-content-${id}`}
        className="w-full px-5 py-3.5 flex items-center gap-3 text-left"
      >
        <span className="material-symbols-outlined text-primary text-[20px]">
          {icon}
        </span>

        <div className="flex-1 min-w-0">
          <h3 className="font-title-md text-title-md text-on-surface font-semibold truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 truncate">
              {subtitle}
            </p>
          )}
        </div>

        {badge && (
          <span className="px-2 py-0.5 bg-primary-container/20 text-primary font-label-xs text-label-xs rounded-full">
            {badge}
          </span>
        )}

        {/* Reorder controls */}
        {(onMoveUp || onMoveDown) && (
          <div className="flex items-center gap-0.5" onClick={(e) => e.stopPropagation()}>
            {onMoveUp && (
              <button
                type="button"
                onClick={onMoveUp}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
                aria-label="Move up"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              </button>
            )}
            {onMoveDown && (
              <button
                type="button"
                onClick={onMoveDown}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
                aria-label="Move down"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_downward</span>
              </button>
            )}
          </div>
        )}

        <span
          className={`
            material-symbols-outlined text-on-surface-variant text-[20px]
            transition-transform duration-200
            ${isExpanded ? 'rotate-180' : ''}
          `}
        >
          expand_more
        </span>
      </button>

      {/* Content */}
      <div
        id={`expandable-content-${id}`}
        role="region"
        className={`
          overflow-hidden transition-all duration-300
          ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-5 pb-5 pt-2 border-t border-outline-variant/30">
          {children}
        </div>
      </div>

      {/* Delete button (only when expanded) */}
      {isExpanded && onDelete && (
        <div className="px-5 pb-4 flex justify-end">
          <button
            type="button"
            onClick={onDelete}
            className="
              flex items-center gap-1.5
              px-3 py-1.5
              text-error
              font-label-xs text-label-xs
              hover:bg-error-container/10
              rounded-lg
              transition-colors duration-150
            "
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}
