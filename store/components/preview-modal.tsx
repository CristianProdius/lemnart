"use client";

import usePreviewModal from "@/hooks/use-preview-modal";
import Modal from '@/components/ui/modal';
import ProductGalleryAndInfo from "@/components/product-gallery-and-info";

const PreviewModal = () => {
    const previewModal = usePreviewModal();
    const product = usePreviewModal((state) => state.data);

    if (!product) {
        return null;
    }

    return (
        <Modal open={previewModal.isOpen} onClose={previewModal.onClose}>
            <ProductGalleryAndInfo product={product} layout="modal" />
        </Modal>
    );
};

export default PreviewModal;
