"use client";

import CustomModal from "@/components/common/modal";
import RegistrationForm from "@/forms/registration.form";
import { content } from "@/content/text.content";

interface IProps {
    isOpen: boolean;
    onClose: () => void;
}

const RegistrationModal = ({ isOpen, onClose }: IProps) => {
    return (
        <CustomModal isOpen={isOpen} onClose={onClose} title={content.auth.createAccount}>
            <RegistrationForm onClose={onClose} />
        </CustomModal>
    );
};

export default RegistrationModal;