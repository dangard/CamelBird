import { Injectable } from "@angular/core";

/**
 * Central logging hook. Uses the browser console today; swap internals later for a vendor or backend sink.
 */
@Injectable({
    providedIn: "root",
})
export class LoggerService {
    debug(message: string, context?: Record<string, unknown>): void {
        console.debug(this.prefix(message), context ?? "");
    }

    info(message: string, context?: Record<string, unknown>): void {
        console.info(this.prefix(message), context ?? "");
    }

    warn(message: string, context?: Record<string, unknown>): void {
        console.warn(this.prefix(message), context ?? "");
    }

    error(message: string, context?: Record<string, unknown>): void {
        console.error(this.prefix(message), context ?? "");
    }

    private prefix(message: string): string {
        return `[CamelBird] ${message}`;
    }
}
