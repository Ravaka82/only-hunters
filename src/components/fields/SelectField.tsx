import React from 'react';
import BaseField from "@/components/fields/BaseField.tsx";
import { SelectField as SelectFieldType } from "@/types.tsx";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface SelectFieldProps extends SelectFieldType {
    options: { value: string; label: string }[];
}

const SelectField: React.FC<SelectFieldProps> = ({ ...props }) => {
    const { t } = useTranslation();
    return (
        <BaseField {...props}>
            {({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                        <SelectValue placeholder={props.placeholder ? props.placeholder : t("select_an_option")}/>
                    </SelectTrigger>
                    <SelectContent>
                        {props.options.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}
        </BaseField>
    );
};

export default SelectField;
