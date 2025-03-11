import React from 'react';
import BaseField from "@/components/fields/BaseField.tsx";
import { TextField as TextFieldType } from "@/types.tsx";
import { Textarea } from '@/components/ui/textarea';


const TextareaField: React.FC<TextFieldType> = (props) => {
  return (
    <BaseField {...props}>
      {({ field, rest }) => (
        <Textarea {...field} {...rest} />
      )}
    </BaseField>
  );
};

export default TextareaField;
