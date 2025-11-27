import * as Sentry from "@sentry/react-router";
import {nodeProfilingIntegration} from "@sentry/profiling-node";
Sentry.init({
    dsn: "https://cf060b9787b2d09c276badfc6342f337@o4510351494152192.ingest.us.sentry.io/4510401863483392",
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/react-router/configuration/options/#sendDefaultPii
    sendDefaultPii: true,

    integrations: [nodeProfilingIntegration()],
});