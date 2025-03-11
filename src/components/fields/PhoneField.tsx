import { Button } from "@/components/ui/button.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.tsx";
import { cn } from "@/lib/utils.ts";

import { PopoverAnchor, PopoverProps } from "@radix-ui/react-popover";
import { DialogProps } from "@radix-ui/react-dialog";
import { TFunction } from "i18next";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import Flag from "react-world-flags";

import React from "react";
import BaseField from "@/components/fields/BaseField.tsx";
import { PhoneField as PhoneFieldType } from "@/types.tsx";
import { useFormContext } from "react-hook-form";
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form'
import { useMediaQuery } from "@/lib/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

interface ContainerComponentProps extends PopoverProps, DialogProps {
  isDesktop: boolean;
}

interface SelectComponentProps extends HTMLSelectElement {
  isDesktop: boolean;
  t: TFunction<'translation', undefined>;
}

interface WrapperProps extends Pick<SelectComponentProps, 'isDesktop'> {
  children: React.ReactNode;
  trigger: React.ReactNode;
}

const ContainerComponent: React.FC<ContainerComponentProps> = ({ isDesktop, children, ...props }) => {
  return isDesktop ? (
    <Popover {...props}>
      <PopoverAnchor className="flex">
        <>{children}</>
      </PopoverAnchor>
    </Popover>
  ) : (
    <Drawer {...props}>
      <div className="flex">
        {children}
      </div>
    </Drawer>
  )
};

const Wrapper: React.FC<WrapperProps> = ({ isDesktop, trigger, children }) => {
  return isDesktop ? (
    <>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0" side="bottom" align="start">
        {children}
      </PopoverContent>
    </>
  ) : (
    <>
      <DrawerTrigger asChild>
        {trigger}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerTitle />
        <DrawerDescription />
        {children}
      </DrawerContent>
    </>
  );
}

const InputComponent = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <Input
      className={cn("rounded-s-none border-l-0", className)}
      {...props}
      ref={ref}
    />
  )
);

const FlagComponent = ({ country, countryName }) => {
  return (
    <span className="bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm">
            <Flag code={country} title={countryName} className="size-fit" />
        </span>
  );
};

const CommandComponent = ({ value, options, handleSelect, t }) => (
  <Command>
    <CommandInput placeholder={t("search_an_option")} />
    <CommandList>
      <CommandEmpty>{t("no_option")}</CommandEmpty>
      <CommandGroup>
        {options.map((option) => (
          <CommandItem
            key={option.value ?? 'XX'}
            onSelect={() => handleSelect(option.value)}
            className={cn(
              "data-[disabled]:pointer-events-auto data-[disabled]:opacity-100",
              "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
              "flex flex-row"
            )}
          >
            <div className="flex items-center space-x-2">
              <FlagComponent country={option.value} countryName={option.label} />
              <span>{option.label}</span>
            </div>
            <CheckIcon
              className={cn(
                "ml-auto h-4 w-4",
                value === option.value ? "opacity-100" : "opacity-0"
              )}
            />
          </CommandItem>
        ))}
      </CommandGroup>
    </CommandList>
  </Command>
);

const CountrySelectComponent: React.FC<SelectComponentProps> = ({ t, isDesktop, value, onChange, options, setOpen, iconComponent, ...props }) => {

  const trigger = (
    <Button
      variant="outline"
      role="combobox"
      className={cn("flex gap-1 rounded-e-none px-3", !value && "text-muted-foreground")}
    >
      <FlagComponent country={value} countryName={value} />
      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
    </Button>
  );

  const handleSelect = (value) => {
    onChange(value);
  }

  return (
    <Wrapper isDesktop={isDesktop} trigger={trigger}>
      <CommandComponent t={t} options={options} value={value} handleSelect={handleSelect} />
    </Wrapper>
  );

};

const PhoneField: React.FC<PhoneFieldType> = (props) => {
  const { control } = useFormContext();
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { t } = useTranslation();

  return (
    <BaseField {...props}>
      {({ field, rest }) => (
        <PhoneInputWithCountry
          {...field}
          {...rest}
          control={control}

          countrySelectComponent={CountrySelectComponent}
          countrySelectProps={{ isDesktop: isDesktop, open: open, setOpen: setOpen, t: t }}

          inputComponent={InputComponent}

          containerComponent={ContainerComponent}
          containerComponentProps={{ isDesktop: isDesktop, open: open, onOpenChange: setOpen }}
        />
      )}
    </BaseField>
  );
};

export default PhoneField;
