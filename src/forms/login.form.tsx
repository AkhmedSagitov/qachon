"use client";

import { Button, Form, Input } from "@heroui/react";
import { useState } from "react";
import {signInWithCredentials} from "@/actions/sign-in";
import { content } from "@/content/text.content";

interface IProps {
    onClose: () => void;
}

const LoginForm = ({ onClose }: IProps) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const result = await signInWithCredentials(formData.email, formData.password);

        if (result?.success === false) {
            setError(result.error || content.auth.loginError);
            return;
        }

        window.location.reload();
        onClose();
    };

    return (
        <Form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            {error && (
                <div className="bg-danger-50 text-danger p-3 rounded-md text-sm">
                    {error}
                </div>
            )}

            <div className="flex flex-col gap-1 w-full">
                <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">
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
                        inputWrapper: "bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700",
                        input: "text-gray-900 dark:text-white text-sm focus:outline-none"
                    }}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    validate={(value) => {
                        if (!value) return content.validation.emailRequired;
                        return null;
                    }}
                />
            </div>

            <div className="flex flex-col gap-1 w-full">
                <label className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                    {content.auth.passwordLabel}
                </label>
                <Input
                    aria-label={content.auth.passwordLabel}
                    isRequired
                    name="password"
                    type="password"
                    value={formData.password}
                    className="w-full"
                    classNames={{
                        inputWrapper: "bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700",
                        input: "text-gray-900 dark:text-white text-sm focus:outline-none"
                    }}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    validate={(value) => {
                        if (!value) return content.validation.passwordRequired;
                        return null;
                    }}
                />
            </div>

            <div className="flex w-[100%] gap-4 items-center pt-4 justify-end">
                <Button variant="light" onPress={onClose} className="text-gray-700 dark:text-gray-300">
                    {content.actions.cancel}
                </Button>
                <Button color="primary" type="submit">
                    {content.auth.signIn}
                </Button>
            </div>
        </Form>
    );
};

export default LoginForm;
