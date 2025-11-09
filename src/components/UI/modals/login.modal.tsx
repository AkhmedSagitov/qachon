"use client";

import CustomModal from "@/components/common/modal";
import LoginForm from "@/forms/login.form";
import { content } from "@/content/text.content";

interface IProps {
    isOpen: boolean;
    onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: IProps) => {
    return (
        <CustomModal isOpen={isOpen} onClose={onClose} title={content.auth.authorization}>
            <LoginForm onClose={onClose} />
        </CustomModal>
    );
};

export default LoginModal;