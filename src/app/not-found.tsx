"use client"
import { content } from "@/content/text.content";

const NotFoundPage = () => {
    return (
        <h1>{content.errors.pageNotFound}</h1>
    );
}
export default NotFoundPage;