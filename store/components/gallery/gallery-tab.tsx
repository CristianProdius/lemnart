import Image from 'next/image';
import { Tab } from '@headlessui/react';
import { cn } from '@/lib/utils'
import { Image as ImageType } from '@/types';

interface GalleryTabProps {
    image: ImageType
}

const GalleryTab: React.FC<GalleryTabProps> = ({ image }) => {
    return (
        <Tab className="relative flex cursor-pointer items-center justify-center aspect-square overflow-hidden bg-[var(--color-muted)]">
            {({ selected }) => (
                <div>
                    <span className="absolute inset-0 aspect-square overflow-hidden">
                        <Image
                            fill
                            alt=""
                            src={image.url}
                            className="object-cover object-center"
                        />
                    </span>
                    <span
                        className={cn(
                            "absolute inset-0 ring-2 ring-offset-1 ring-offset-[#1A1A1A]",
                            selected
                                ? "ring-[var(--color-accent-light)]"
                                : "ring-transparent"
                        )}
                    />
                </div>
            )}
        </Tab>
    );
}

export default GalleryTab;
