import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import {sentryReactRouter, type SentryReactRouterBuildOptions} from "@sentry/react-router";
import path from "node:path";
import * as fs from "node:fs";

const __dirname = path.resolve();


const sentryConfig: SentryReactRouterBuildOptions = {
    org: "kalyan-a7",
    project: "travel-agency",
    // An auth token is required for uploading source maps;
    // store it in an environment variable to keep it secure.
    authToken: process.env.SENTRY_AUTH_TOKEN,
    // ...
};



export default defineConfig(config => {
    return {
        plugins: [tailwindcss(), tsconfigPaths(), reactRouter(),sentryReactRouter(sentryConfig, config)],
        sentryConfig,
        ssr: {
            noExternal: [/@syncfusion/]
        },
        server: {
            https: {
                key: fs.readFileSync(path.resolve(__dirname, '.cert/localhost+2-key.pem')),
                cert: fs.readFileSync(path.resolve(__dirname, '.cert/localhost+2.pem')),
            },
        }
    };
});
