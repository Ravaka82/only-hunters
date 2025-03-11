import React from 'react';
import BaseField from "@/components/fields/BaseField.tsx";
import { ComboboxField as ComboboxFieldType } from "@/types.tsx";
import ResponsiveCombobox from "@/components/ResponsiveCombobox";
import Flag from "react-world-flags";

const ComboboxField: React.FC<ComboboxFieldType> = (props) => {
  return (
      <BaseField {...props}>
        {({ field }) => (
            <ResponsiveCombobox
                value={field.value}
                options={props.options}
                onChange={field.onChange}
                placeholder={props.placeholder}
                // disabled={props.disabled}
                renderItem={(option) => (
                    <>
                      {option.flag && <Flag code={option.flag} className="h-4 w-6 mr-3 rounded" />}
                      {option.label}
                    </>
                )}
                renderButtonContent={(value) => (
                    value ? (
                        <div className="flex items-center">
                          {props.options.find((option) => option.value === value)?.flag && (
                              <Flag code={props.options.find((option) => option.value === value)?.flag} className="h-4 w-6 mr-3 rounded" />
                          )}
                          {props.options.find((option) => option.value === value)?.label}
                        </div>
                    ) : (
                        props.placeholder
                    )
                )}
            />
        )}
      </BaseField>
  );
};

export default ComboboxField;
