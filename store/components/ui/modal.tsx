"use client"

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { X } from "lucide-react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
    return (
        <Transition show={open} appear as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl overflow-hidden text-left align-middle">
                                <div className="relative overflow-hidden bg-[var(--th-surface)] p-6 shadow-2xl sm:p-8 lg:p-10">
                                    <button
                                        onClick={onClose}
                                        className="absolute right-4 top-4 flex size-8 items-center justify-center text-[var(--th-text-tertiary)] transition hover:text-[rgb(var(--th-text))]"
                                        aria-label="Închide"
                                    >
                                        <X size={18} />
                                    </button>
                                    {children}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}

export default Modal;
