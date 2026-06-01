import { AbstractControl, ValidationErrors } from "@angular/forms";

/** Validates min length only when the field is non-empty (optional password on edit). */
export function optionalMinLength(
    min: number,
): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = String(control.value ?? "").trim();
        if (!value) return null;
        return value.length >= min
            ? null
            : {
                  minlength: {
                      requiredLength: min,
                      actualLength: value.length,
                  },
              };
    };
}

export const optionalPasswordValidator = optionalMinLength(8);
