import React from "react";
import BaseField from "@/components/fields/BaseField.tsx";
import { MultiCheckboxField as MultiCheckboxFieldType } from "@/types.tsx";
import { Checkbox } from "@/components/ui/checkbox";
import { useFormContext } from "react-hook-form";

const MultiCheckboxField: React.FC<MultiCheckboxFieldType> = (props) => {
    const { name } = props;

    const { setValue, watch } = useFormContext();
    const selectedValues: string[] = Array.isArray(watch(name)) ? watch(name) : [];

    const handleChecked = (value: string, checked: boolean) => {
        const newValues = checked
            ? [...selectedValues, value]
            : selectedValues.filter((v) => v !== value);

        setValue(name, newValues, { shouldValidate: true });
    };

    return (
        <div className="relative rounded-lg border p-4">
            <BaseField {...props}>
                {() => (
                    <div className="flex-col space-y-2">
                        {props.options.map((option) => (
                            <div key={option.value} className="flex space-x-2 text-sm">
                                <Checkbox
                                    className="size-5"
                                    checked={selectedValues.includes(option.value)}
                                    onCheckedChange={(checked: boolean) => handleChecked(option.value, checked)}
                                />
                                <span>{option.label}</span>
                            </div>
                        ))}
                    </div>
                )}
            </BaseField>
        </div>
    );
};

export default MultiCheckboxField;
