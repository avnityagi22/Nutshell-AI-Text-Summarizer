import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        allowedHosts: ["nutshell-ai-text-summarizer-frontend-xjok.onrender.com"],
    },
});
