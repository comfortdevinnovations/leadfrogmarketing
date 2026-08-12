import type { ComponentType } from "react";
import { LilyPadIcon } from "@/components/icons";

export default function LilyPadBadge({
  icon: Icon,
  className = "h-14 w-14",
  iconClassName = "h-6 w-6",
}: {
  icon: ComponentType<{ className?: string }>;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div
      className={`relative shrink-0 text-primary drop-shadow-[0_10px_18px_-8px_rgba(11,58,68,0.55)] ${className}`}
    >
      <LilyPadIcon className="absolute inset-0 h-full w-full" />
      <Icon
        className={`absolute left-[44%] top-[46%] -translate-x-1/2 -translate-y-1/2 text-secondary ${iconClassName}`}
      />
    </div>
  );
}
