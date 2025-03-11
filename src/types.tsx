import { z } from 'zod';
import { FeatureProps } from "react-phone-number-input";

export type DefaultTypes = string | number | boolean | Date | FileList | undefined;

export interface BaseField {
    label: string;
    name: string;
    rules: z.ZodTypeAny;
    default?: DefaultTypes;
    description?: string;
    dependsOn?: string;
    condition?: string | number | boolean;
}

export interface TextField extends BaseField {
    as?: 'input' | 'textarea';
    type?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    step?: number;
    pattern?: string;
    placeholder?: string;
}

export interface PhoneField<T = undefined> extends BaseField,
        Pick<FeatureProps<T>, 'international' | 'defaultCountry' | 'initialValueFormat'> {
    as: 'phone';
    placeholder?: string;
}

export interface CheckboxField extends BaseField {
    as: 'checkbox';
}

export interface MultiCheckboxField extends BaseField {
    as: 'multicheckbox';
    options: { value: string; label: string }[];
}

export interface SelectField extends BaseField {
    as: 'select';
    placeholder?: string;
    options: { value: string; label: string }[];
}

export interface RadioField extends BaseField {
    as: 'radio';
    options: { value: string; label: string }[];
}

export interface SwitchField extends BaseField {
    as: 'switch';
}

export interface ComboboxField extends BaseField {
    as: 'combobox';
    placeholder?: string;
    options: { value: string; label: string, flag?: string }[];
}

export interface BirthdateField extends BaseField {
    as: 'birthdate';
    minDate?: Date;
    maxDate?: Date;
}

export interface FileField extends BaseField {
    as: 'file';
    accept?: string;
}

export type Field =
    | TextField
    | PhoneField
    | CheckboxField
    | MultiCheckboxField
    | SelectField
    | RadioField
    | SwitchField
    | ComboboxField
    | BirthdateField
    | FileField;

export interface Step {
    title?: string;
    description?: string;
    fields: Field[];
}

export const hasPlaceholder = (field: Field): field is TextField => {
    return 'placeholder' in field;
};
