"use client"

import { useEffect, useState } from "react";
import Image from "next/image";

interface BackgroundVideoProps {
    src: string;
    poster?: string;
    disableOnMobile?: boolean;
    className?: string;
}

const BackgroundVideo: React.FC<BackgroundVideoProps> = ({
    src,
    poster,
    disableOnMobile = true,
    className = "",
}) => {
    const [showVideo, setShowVideo] = useState(false);

    useEffect(() => {
        const isInIframe = window.parent !== window;
        if (disableOnMobile && !isInIframe && window.innerWidth < 768) {
            setShowVideo(false);
        } else {
            setShowVideo(true);
        }
    }, [disableOnMobile]);

    if (!showVideo) {
        return poster ? (
            <Image
                src={poster}
                alt=""
                fill
                aria-hidden="true"
                className={`object-cover ${className}`}
            />
        ) : null;
    }

    return (
        <video
            autoPlay
            loop
            muted
            playsInline
            poster={poster}
            className={`absolute inset-0 h-full w-full object-cover ${className}`}
        >
            <source src={src} type="video/mp4" />
        </video>
    );
};

export default BackgroundVideo;
