import { ValidatorFn } from '@angular/forms';

export interface FieldConfig {
    disabled?: boolean,
    label?: string,
    name: string,
    options?: any[],
    placeholder?: string,
    size?: string,
    type: string,
    valueType?: string,
    z_index?: string,
    validation?: ValidatorFn[],
    value?: any,
    spacing?: string,
}
