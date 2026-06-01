import { enableProdMode } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import {
    provideHttpClient,
    withFetch,
    withInterceptors,
} from "@angular/common/http";
import { provideRouter } from "@angular/router";

import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";
import { authInterceptor } from "./app/core/auth/auth.interceptor";
import { tokenRefreshInterceptor } from "./app/core/auth/token-refresh.interceptor";
import { httpErrorInterceptor } from "./app/core/http-error.interceptor";
import { environment } from "./environments/environment";

if (environment.production) enableProdMode();

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(routes),
        provideHttpClient(
            withFetch(),
            withInterceptors([
                httpErrorInterceptor,
                tokenRefreshInterceptor,
                authInterceptor,
            ]),
        ),
    ],
}).catch((err) => console.error(err));
