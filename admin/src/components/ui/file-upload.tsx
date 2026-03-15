"use client"

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, Trash, FileBox } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface FileUploadProps {
    disabled?: boolean;
    onChange: (url: string) => void;
    onRemove: () => void;
    value: string;
    accept?: string;
    label?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
    disabled,
    onChange,
    onRemove,
    value,
    accept = "*/*",
    label = "Upload a file",
}) => {
    const [isMounted, setIsMounted] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const isImage = value && /\.(png|jpe?g|gif|webp|svg)$/i.test(value);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", files[0]);

            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Upload failed");
            }

            const data = await res.json();
            onChange(data.url);
        } catch {
            toast.error("Failed to upload file.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            {value && (
                <div className='mb-4 flex items-center gap-4'>
                    <div className='relative flex items-center gap-3 rounded-md border p-3'>
                        <div className='z-10 absolute top-2 right-2'>
                            <Button type='button' onClick={onRemove} variant="destructive" size="icon" className="h-6 w-6">
                                <Trash className='w-3 h-3' />
                            </Button>
                        </div>
                        {isImage ? (
                            <div className="relative w-[120px] h-[120px] overflow-hidden rounded">
                                <Image fill className='object-cover' alt='Preview' src={value} />
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 pr-8">
                                <FileBox className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground max-w-[200px] truncate">
                                    {value.split('/').pop()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                className="hidden"
                onChange={onFileChange}
                disabled={disabled || uploading}
            />
            <Button
                type='button'
                disabled={disabled || uploading}
                variant='secondary'
                onClick={() => fileInputRef.current?.click()}
            >
                <Upload className='h-4 w-4 mr-2' />
                {uploading ? "Uploading..." : label}
            </Button>
        </div>
    );
};

export default FileUpload;
