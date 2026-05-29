export const CONTACT_SUBJECTS = [
    "Resume Request",
    "General Question",
    "Saying Hello",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

export interface ContactRequest {
    subject: ContactSubject;
    name: string;
    email: string;
    message: string;
    website: string;
}

export interface ContactResponse {
    message: string;
}

export interface ContactValidationErrorResponse {
    message: string;
    errors?: Record<string, string>;
}
