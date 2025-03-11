import React from 'react';
import BaseField from "@/components/fields/BaseField.tsx";
import { SwitchField as SwitchFieldType } from "@/types.tsx";
import { Switch } from "@/components/ui/switch";

const SwitchField: React.FC<SwitchFieldType> = (props) => {
    return (
        <div className="relative rounded-lg border p-4">
            <BaseField {...props}>
                {({ field }) => (
                    <div className="float-right ml-4">
                        <Switch
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

export default SwitchField;
