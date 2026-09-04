'use client';

interface AchievementCardProps {
  value: string;
  metrics?: string[];
  onEdit?: () => void;
  onDelete?: () => void;
  onImprove?: () => void;
}

export function AchievementCard({
  value,
  metrics = [],
  onEdit,
  onDelete,
  onImprove,
}: AchievementCardProps) {
  return (
    <div className="group relative pl-7 py-2.5 border-l-2 border-primary-container/40 hover:border-primary transition-colors duration-200">
      {/* Check icon */}
      <span className="absolute left-0 top-2.5 material-symbols-outlined text-success text-[18px]">
        check_circle
      </span>

      {/* Content */}
      <div className="space-y-1.5">
        <p className="font-body-md text-body-md text-on-surface leading-relaxed">
          {value}
        </p>

        {metrics.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {metrics.map((metric, index) => (
              <span
                key={index}
                className="
                  inline-flex items-center
                  px-2 py-0.5
                  bg-surface-container
                  text-on-surface-variant
                  font-label-xs text-label-xs
                  rounded-full
                "
              >
                {metric}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions (appear on hover) */}
      <div className="absolute right-0 top-2.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200">
        {onImprove && (
          <button
            type="button"
            onClick={onImprove}
            className="
              min-w-[36px] min-h-[36px]
              flex items-center justify-center
              text-primary
              hover:bg-primary-container/20
              rounded-lg
              transition-colors duration-150
            "
            title="Improve with AI"
          >
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          </button>
        )}

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="
              min-w-[36px] min-h-[36px]
              flex items-center justify-center
              text-on-surface-variant
              hover:bg-surface-container
              rounded-lg
              transition-colors duration-150
            "
            title="Edit"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
          </button>
        )}

        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="
              min-w-[36px] min-h-[36px]
              flex items-center justify-center
              text-error
              hover:bg-error-container/10
              rounded-lg
              transition-colors duration-150
            "
            title="Delete"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
