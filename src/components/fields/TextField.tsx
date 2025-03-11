import React from "react";
import BaseField from "@/components/fields/BaseField.tsx";
import { TextField as TextFieldType } from "@/types.tsx";
import { Input } from "@/components/ui/input";

const TextField: React.FC<TextFieldType> = (props) => {
  return (
    <BaseField {...props}>
      {({ field, rest }) => (
        <Input {...field} {...rest} />
      )}
    </BaseField>
  );
};

export default TextField;
