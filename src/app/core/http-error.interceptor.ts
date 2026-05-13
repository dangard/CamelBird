import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";

import { LoggerService } from "./logger.service";

/** Logs failed HTTP responses globally; callers still receive errors via Observables. */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const logger = inject(LoggerService);

    return next(req).pipe(
        catchError((err: unknown) => {
            if (err instanceof HttpErrorResponse)
                logger.error("HTTP request failed", {
                    url: req.url,
                    method: req.method,
                    status: err.status,
                    statusText: err.statusText,
                });
            else
                logger.error("HTTP unknown failure", {
                    message: String(err),
                    url: req.url,
                });

            return throwError(() => err);
        }),
    );
};
