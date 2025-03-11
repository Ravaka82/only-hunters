import React from 'react';
import BaseField from "@/components/fields/BaseField.tsx";
import { ComboboxField as ComboboxFieldType } from "@/types.tsx";
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';
import Flag from "react-world-flags";


const ComboboxField: React.FC<ComboboxFieldType> = (props) => {
  return (
      <BaseField {...props}>
        {({ field }) => (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded="false"
                    className={cn(
                        'w-full justify-between',
                        !field.value && 'text-muted-foreground'
                    )}
                >
                  {field.value ? (
                      <>
                        {props.options.find((option) => option.value === field.value)?.flag && (
                            <Flag code={props.options.find((option) => option.value === field.value)?.flag} className="h-4 w-6" />
                        )}
                        {props.options.find((option) => option.value === field.value)?.label}
                      </>
                  ) : (
                      'Select an option'
                  )}
                  <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search option..." />
                  <CommandList>
                    <CommandEmpty>No option found.</CommandEmpty>
                    <CommandGroup>
                      {props.options.map((option) => (
                          <CommandItem
                              key={option.value}
                              onSelect={() => {
                                field.onChange(option.value);
                              }}
                              className={cn(
                                  'data-[disabled]:pointer-events-auto data-[disabled]:opacity-100',
                                  'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
                              )}
                          >
                            {option.label}
                            {option.flag && <Flag code={option.flag} className="h-4 w-6" />}
                            <CheckIcon
                                className={cn(
                                    'ml-auto h-4 w-4',
                                    field.value === option.value
                                        ? 'opacity-100'
                                        : 'opacity-0'
                                )}
                            />
                          </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
        )}
      </BaseField>
  );
};

export default ComboboxField;
