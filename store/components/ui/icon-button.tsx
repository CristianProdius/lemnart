import { cn } from "@/lib/utils";
import { MouseEventHandler } from "react";

interface IconButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
    icon: React.ReactElement;
    className?: string;
    "aria-label"?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, className, icon, "aria-label": ariaLabel }) => {
    return (
        <button
            onClick={onClick}
            aria-label={ariaLabel}
            className={cn("rounded-full flex items-center justify-center bg-white border shadow-md p-2 hover:scale-110 transition", className)}>
                {icon}
        </button>
     );
}
 
export default IconButton;