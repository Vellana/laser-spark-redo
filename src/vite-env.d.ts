/// <reference types="vite/client" />

// Instagram embed types
interface Window {
    instgrm?: {
        Embeds: {
            process: () => void;
        };
    };
}
