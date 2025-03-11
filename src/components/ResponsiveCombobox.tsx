import React, {CSSProperties, ReactNode} from "react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/lib/use-media-query";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import {PopoverAnchor} from "@radix-ui/react-popover";

interface Option {
    value: string;
    label: string;
    flag?: string;
}

interface ResponsiveComboboxProps {
    value: string | undefined;
    options: Option[];
    onChange: (value: string) => void;
    placeholder?: string;
    renderItem: (option: Option) => ReactNode;
    renderButtonContent: (value: string | undefined) => ReactNode;
    disabled?: boolean;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
}

const ResponsiveCombobox: React.FC<ResponsiveComboboxProps> = ({
                                                                   value,
                                                                   options,
                                                                   onChange,
                                                                   placeholder,
                                                                   renderItem,
                                                                   renderButtonContent,
                                                                   disabled,
                                                                   style,
                                                                   children
                                                               }) => {
    const { t } = useTranslation();
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const handleSelect = (value: string) => {
        onChange(value);
        setOpen(false);
    };

    const renderComboboxContent = () => (
        <Command>
            <CommandInput placeholder={placeholder || t("search_an_option")} />
            <CommandList>
                <CommandEmpty>{t("no_option")}</CommandEmpty>
                <CommandGroup>
                    {options.map((option) => (
                        <CommandItem
                            key={option.value}
                            onSelect={() => handleSelect(option.value)}
                            className={cn(
                                "data-[disabled]:pointer-events-auto data-[disabled]:opacity-100",
                                "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                                "flex flex-row"
                            )}
                        >
                            {renderItem(option)}
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

    return isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverAnchor asChild>
                <div>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between font-normal text-foreground"
                            disabled={disabled}
                            style={style}
                        >
                            {renderButtonContent(value)}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    {children}
                </div>
            </PopoverAnchor>
            <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0" side="bottom" align="start">
                {renderComboboxContent()}
            </PopoverContent>
        </Popover>
    ) : (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal text-foreground"
                    disabled={disabled}
                >
                    {renderButtonContent(value)}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DrawerTrigger>
            <DrawerContent>{renderComboboxContent()}</DrawerContent>
        </Drawer>
    );
};

export default ResponsiveCombobox;
