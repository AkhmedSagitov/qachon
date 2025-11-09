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
                base: "bg-white dark:bg-gray-900",
                backdrop: "bg-black/50",
                wrapper: "items-center"
            }}
        >
            <ModalContent className="bg-white dark:bg-gray-900 my-4 mx-2">
                <ModalHeader className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <h3 className="text-xl text-gray-900 dark:text-white font-semibold">{title}</h3>
                </ModalHeader>
                <ModalBody className="space-y-4 py-4 sm:py-6 bg-white dark:bg-gray-900">
                    {children}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CustomModal;