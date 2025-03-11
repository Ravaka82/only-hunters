import React from 'react';
import BaseField from "@/components/fields/BaseField.tsx";
import { RadioField as RadioFieldType } from "@/types.tsx";
import { FormControl, FormItem } from "@/components/ui/form.tsx";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const RadioGroupField: React.FC<RadioFieldType> = (props) => {
    return (
        <BaseField {...props}>
          {({ field }) => (
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
            >
              {props.options.map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-2">
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <Label>{option.label}</Label>
                </FormItem>
              ))}
            </RadioGroup>
          )}
        </BaseField>
    );
};

export default RadioGroupField;
