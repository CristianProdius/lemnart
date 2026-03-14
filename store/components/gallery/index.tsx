"use client"

import Image from 'next/image';
import { Tab } from '@headlessui/react';
import { Image as ImageType } from '@/types'
import GalleryTab from './gallery-tab';

interface GalleryProps {
    images: ImageType[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
    return (
        <Tab.Group as="div" className="flex flex-col-reverse">
            <div className="mt-4 hidden w-full sm:block">
                <Tab.List className="grid grid-cols-4 gap-3">
                    {images.map(image => (
                        <GalleryTab key={image.id} image={image} />
                    ))}
                </Tab.List>
            </div>
            <Tab.Panels className="aspect-square w-full overflow-hidden">
                {images.map(image => (
                    <Tab.Panel key={image.id}>
                        <div className="relative aspect-square w-full overflow-hidden bg-[var(--color-muted)]">
                            <Image
                                fill
                                alt={`Product image`}
                                src={image.url}
                                className="object-cover object-center"
                            />
                        </div>
                    </Tab.Panel>
                ))}
            </Tab.Panels>
        </Tab.Group>
    );
}

export default Gallery;
