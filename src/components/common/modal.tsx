"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { ReactNode } from "react";

interface IProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const CustomModal = ({
                         isOpen,
                         onClose,
                         title,
                         children,
                         size = "xs"
                     }: IProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={size}
            placement="center"
            scrollBehavior="inside"
            classNames={{
                base: "bg-white",
                backdrop: "bg-black/50"
            }}
        >
            <ModalContent className="bg-white">
                <ModalHeader className="border-b border-gray-200 bg-white">
                    <h3 className="text-xl text-gray-900 font-semibold">{title}</h3>
                </ModalHeader>
                <ModalBody className="space-y-4 py-4 sm:py-6 bg-white">
                    {children}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CustomModal;