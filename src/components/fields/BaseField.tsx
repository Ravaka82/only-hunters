import React from 'react';
import { BaseField as BaseFieldType } from '@/types.tsx';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from '@/components/ui/form';
import { ControllerRenderProps, useFormContext } from "react-hook-form";
import { z } from "zod";

interface ChildrenProps<T> {
    field: ControllerRenderProps;
    rest: Omit<T, 'name' | 'label' | 'description'>
}

interface BaseFieldProps extends BaseFieldType {
    children: (props: ChildrenProps<BaseFieldType>) => React.ReactNode;
    className?: string;
}

const isRequired = (schema: z.ZodTypeAny): boolean => {
  if (schema instanceof z.ZodLiteral && schema._def.value === true) {
    return true;
  }

  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable || schema instanceof z.ZodBoolean) {
    return false;
  }

  if (schema instanceof z.ZodUnion) {
    return schema._def.options.every(isRequired);
  }

  return true;
};

const BaseField: React.FC<BaseFieldProps> = ({ children, ...props }) => {
    const { name, label, description, className, ...rest } = props;
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className}>
                    <FormLabel>
                      {label}
                      {isRequired(props.rules) ? <span className="text-destructive text-lg">&nbsp;*</span> : ''}
                      &nbsp;:
                    </FormLabel>
                    <FormControl>
                        {typeof children === 'function' ? children({ field, rest }) : children}
                    </FormControl>
                    {description && <FormDescription className="text-xs">{description}</FormDescription>}
                    <FormMessage className="text-xs" />
                </FormItem>
            )}
        />
    );
};

export default BaseField;
