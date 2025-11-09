"use client";

import { Button, Form, Input } from "@heroui/react";
import { useState } from "react";
import {registerUser} from "@/actions/register";
import { UserRole } from "@/generated/prisma";
import { content } from "@/content/text.content";

interface IProps {
    onClose: () => void;
}

interface FormData {
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    phone: string;
    role: UserRole;
}

const RegistrationForm = ({ onClose }: IProps) => {
    const [formData, setFormData] = useState<FormData>({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phone: "",
        role: UserRole.OWNER
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const result = await registerUser(formData);

        if (result.error) {
            setError(result.error);
            return;
        }

        setSuccess(true);
        setTimeout(() => {
            onClose();
            window.location.reload(); // Reload to update auth state
        }, 2000);
    }

    return (
        <Form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
            {error && (
                <div className="bg-danger-50 text-danger p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 border-2 border-green-500 text-green-800 p-4 rounded-lg text-base font-semibold flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    <span>{content.auth.registrationSuccess}</span>
                </div>
            )}

            <div className="flex flex-col gap-0.5 w-full">
                <label className="text-gray-700 font-medium text-sm">
                    {content.auth.emailLabel}
                </label>
                <Input
                    aria-label={content.auth.emailLabel}
                    isRequired
                    name="email"
                    type="email"
                    value={formData.email}
                    className="w-full"
                    classNames={{
                        inputWrapper: "bg-gray-100 border-2 border-gray-200",
                        input: "text-gray-900 text-sm focus:outline-none"
                    }}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    validate={(value) => {
                        if (!value) return content.validation.emailRequired;
                        if (!validateEmail(value)) return content.validation.emailFormat;
                        return null;
                    }}
                />
            </div>

            <div className="flex flex-col gap-0.5 w-full">
                <label className="text-gray-700 font-medium text-sm">
                    {content.auth.nameLabel}
                </label>
                <Input
                    name="name"
                    type="text"
                    value={formData.name}
                    className="w-full"
                    classNames={{
                        inputWrapper: "bg-gray-100 border-2 border-gray-200",
                        input: "text-gray-900 text-sm focus:outline-none"
                    }}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <div className="flex flex-col gap-0.5 w-full">
                <label className="text-gray-700 font-medium text-sm">
                    {content.auth.phoneLabel}
                </label>
                <Input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    className="w-full"
                    classNames={{
                        inputWrapper: "bg-gray-100 border-2 border-gray-200",
                        input: "text-gray-900 text-sm focus:outline-none"
                    }}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>

            <div className="flex flex-col gap-0.5 w-full">
                <label className="text-gray-700 font-medium text-sm">
                    {content.auth.passwordLabel}
                </label>
                <Input
                    isRequired
                    name="password"
                    type="password"
                    value={formData.password}
                    className="w-full"
                    classNames={{
                        inputWrapper: "bg-gray-100 border-2 border-gray-200",
                        input: "text-gray-900 text-sm focus:outline-none"
                    }}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    validate={(value) => {
                        if (!value) return content.validation.passwordRequired;
                        if (value.length < 6) return content.auth.passwordMinLength;
                        return null;
                    }}
                />
            </div>

            <div className="flex flex-col gap-0.5 w-full">
                <label className="text-gray-700 font-medium text-sm">
                    {content.auth.confirmPasswordLabel}
                </label>
                <Input
                    isRequired
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    className="w-full"
                    classNames={{
                        inputWrapper: "bg-gray-100 border-2 border-gray-200",
                        input: "text-gray-900 text-sm focus:outline-none"
                    }}
                    onChange={(e) =>
                        setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    validate={(value) => {
                        if (!value) return content.auth.confirmPasswordRequired;
                        if (value !== formData.password) return content.auth.passwordsDoNotMatch;
                        return null;
                    }}
                />
            </div>

            <div className="flex w-[100%] gap-4 items-center pt-2 sm:pt-4 justify-end">
                <Button variant="light" onPress={onClose} className="text-gray-700">
                    {content.actions.cancel}
                </Button>
                <Button color="primary" type="submit">
                    {content.auth.register}
                </Button>
            </div>
        </Form>
    );
};

export default RegistrationForm;
