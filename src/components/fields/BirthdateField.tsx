import React, { useState, useEffect, useMemo } from "react";
import BaseField from '@/components/fields/BaseField.tsx';
import { BirthdateField as BirthdateFieldType } from "@/types.tsx";
import { useFormContext } from "react-hook-form";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { getDaysInMonth, isBefore, isAfter } from 'date-fns';
import { useTranslation } from "react-i18next";


const BirthdateField: React.FC<BirthdateFieldType> = (props) => {
    const { t } = useTranslation();
    const { name, minDate, maxDate } = props;
    const { setValue, watch, reset } = useFormContext();
    const currentYear = new Date().getUTCFullYear();
    const minYear = minDate ? minDate.getUTCFullYear() : currentYear - 100;
    const maxYear = maxDate ? maxDate.getUTCFullYear() : currentYear;

    const initialDate: Date | string | undefined = watch(name);
    const parsedDate = useMemo(() => {
        return initialDate ? new Date(initialDate) : undefined;
    }, [initialDate]);

    useEffect(() => {
        if (initialDate && !(initialDate instanceof Date)) {
            const parsedDate = new Date(initialDate);
            setValue(name, parsedDate, { shouldValidate: true });
        }
    }, [name, initialDate, setValue]);

    const initialYear = parsedDate ? parsedDate.getUTCFullYear().toString() : '';
    const initialMonth = parsedDate ? (parsedDate.getUTCMonth() + 1).toString() : '';
    const initialDay = parsedDate ? parsedDate.getUTCDate().toString() : '';

    const [year, setYear] = useState<string>(initialYear);
    const [month, setMonth] = useState<string>(initialMonth);
    const [day, setDay] = useState<string>(initialDay);

    useEffect(() => {
        if (parsedDate) {
            setYear(initialYear);
            setMonth(initialMonth);
            setDay(initialDay);
        } else {
            setYear('');
            setMonth('');
            setDay('');
        }
    }, [parsedDate, reset, initialYear, initialMonth, initialDay]);

    const handleDateChange = (type: 'year' | 'month' | 'day', value: string) => {
        let newYear = year;
        let newMonth = month;
        let newDay = day;

        if (type === 'year') {
            newYear = value;
            if (!isDateInRange(parseInt(newYear), parseInt(newMonth || "1"), parseInt(newDay || "1"))) {
                newMonth = '';
                newDay = '';
            }
        } else if (type === 'month') {
            newMonth = value;
            if (!isDateInRange(parseInt(newYear || "0"), parseInt(newMonth), parseInt(newDay || "1"))) {
                newDay = '';
            }
        } else {
            newDay = value;
        }

        setYear(newYear);
        setMonth(newMonth);
        setDay(newDay);

        if (newYear && newMonth && newDay) {
            const date = new Date(Date.UTC(
                parseInt(newYear, 10),
                parseInt(newMonth, 10) - 1,
                parseInt(newDay, 10)
            ));
            date.setUTCHours(0, 0, 0, 0);
            setValue(name, date, { shouldValidate: true });
        } else {
            setValue(name, null, { shouldValidate: false });
        }
    };

    const updateDaysInMonth = (selectedYear: string, selectedMonth: string) => {
        const daysInMonth = getDaysInMonth(new Date(Date.UTC(parseInt(selectedYear, 10), parseInt(selectedMonth, 10) - 1)));
        return Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
    };

    const isDateInRange = (year: number, month: number, day: number) => {
        const date = new Date(Date.UTC(year, month - 1, day));
        if (minDate && isBefore(date, minDate)) return false;
        else if (maxDate && isAfter(date, maxDate)) return false;
        return true;
    };

    const isDaySelectable = (day: string, selectedYear: string, selectedMonth: string) => {
        const date = new Date(Date.UTC(parseInt(selectedYear, 10), parseInt(selectedMonth, 10) - 1, parseInt(day)));
        return isDateInRange(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
    };

    const isMonthSelectable = (selectedMonth: string, selectedYear: string) => {
        const daysInMonth = getDaysInMonth(new Date(Date.UTC(parseInt(selectedYear, 10), parseInt(selectedMonth, 10) - 1)));
        for (let day = 1; day <= daysInMonth; day++) {
            if (isDateInRange(parseInt(selectedYear, 10), parseInt(selectedMonth, 10), day)) {
                return true;
            }
        }
        return false;
    };

    return (
      <BaseField {...props}>
          {() => (
            <div className="flex space-x-2">
                <Select
                  onValueChange={(value) => handleDateChange("year", value)}
                  value={year}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={t("year")} />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: maxYear - minYear + 1 }, (_, i) => (maxYear - i).toString()).map((year) => (
                          <SelectItem key={year} value={year}>
                              {year}
                          </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                  onValueChange={(value) => handleDateChange("month", value)}
                  value={month}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={t("month")}/>
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => ({
                            value: (i + 1).toString(),
                            label: new Date(0, i).toLocaleString("default", { month: "long" }),
                        })).map((month) => (
                          <SelectItem
                            key={month.value}
                            value={month.value}
                            disabled={!isMonthSelectable(month.value, year || "0")}
                          >
                              {month.label}
                          </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select
                  onValueChange={(value) => handleDateChange("day", value)}
                  value={day}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={t("day")}/>
                    </SelectTrigger>
                    <SelectContent>
                        {year && month && updateDaysInMonth(year, month).map((day) => (
                          <SelectItem
                            key={day}
                            value={day}
                            disabled={!isDaySelectable(day, year, month)}
                          >
                              {day}
                          </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          )}
      </BaseField>
    );
};

export default BirthdateField;