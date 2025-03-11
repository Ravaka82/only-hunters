import React from "react";
import BaseField from "@/components/fields/BaseField.tsx";
import { CheckboxField as CheckboxFieldType } from "@/types.tsx";
import { Checkbox } from "@/components/ui/checkbox";

const CheckboxField: React.FC<CheckboxFieldType> = (props) => {
    return (
        <div className="rounded-lg border p-4">
            <BaseField {...props} className="relative">
                {({field}) => (
                    <div className="float-left mr-4 pb-4">
                        <Checkbox
                            className="size-5"
                            {...field}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                    </div>
                )}
            </BaseField>
        </div>
    );
};

export default CheckboxField;
