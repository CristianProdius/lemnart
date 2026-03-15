"use client"

import { useCallback, useEffect, useRef, useState } from "react";
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
    const videoRef = useRef<HTMLVideoElement>(null);
    const rafRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    useEffect(() => {
        const isInIframe = window.parent !== window;
        if (disableOnMobile && !isInIframe && window.innerWidth < 768) {
            setShowVideo(false);
        } else {
            setShowVideo(true);
        }
    }, [disableOnMobile]);

    const reverseStep = useCallback((timestamp: number) => {
        const video = videoRef.current;
        if (!video) return;

        if (lastTimeRef.current === 0) {
            lastTimeRef.current = timestamp;
        }

        const delta = (timestamp - lastTimeRef.current) / 1000;
        lastTimeRef.current = timestamp;

        video.currentTime = Math.max(0, video.currentTime - delta);

        if (video.currentTime <= 0.05) {
            lastTimeRef.current = 0;
            video.currentTime = 0;
            video.play();
            return;
        }

        rafRef.current = requestAnimationFrame(reverseStep);
    }, []);

    const handleEnded = useCallback(() => {
        lastTimeRef.current = 0;
        rafRef.current = requestAnimationFrame(reverseStep);
    }, [reverseStep]);

    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

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
            ref={videoRef}
            autoPlay
            muted
            playsInline
            poster={poster}
            onEnded={handleEnded}
            className={`absolute inset-0 h-full w-full object-cover ${className}`}
        >
            <source src={src} type="video/mp4" />
        </video>
    );
};

export default BackgroundVideo;
