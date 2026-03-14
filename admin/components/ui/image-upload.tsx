"use client"

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value
}) => {

    const [isMounted, setIsMounted] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("file", files[i]);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error("Upload failed");
                }

                const data = await res.json();
                onChange(data.url);
            }
        } catch {
            toast.error("Failed to upload image.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    }

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <div className='mb-4 flex items-center gap-4'>
                {value.map((url) => (
                    <div key={url} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
                        <div className='z-10 absolute top-2 right-2'>
                            <Button type='button' onClick={() => onRemove(url)} variant="destructive" size="icon">
                                <Trash className='w-4 h-4'/>
                            </Button>
                        </div>
                        <Image fill className='object-cover' alt='Image' src={url} />
                    </div>
                ))}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={onFileChange}
                disabled={disabled || uploading}
            />
            <Button
                type='button'
                disabled={disabled || uploading}
                variant={'secondary'}
                onClick={() => fileInputRef.current?.click()}
            >
                <ImagePlus className='h-4 w-4 mr-2' />
                {uploading ? "Uploading..." : "Upload an Image"}
            </Button>
        </div>
    )
};

export default ImageUpload
