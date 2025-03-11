import { z } from 'zod';
import { Step } from '@/types';
import {
    ContactNameEnum,
    ContactValidationRegex,
    EnglishLevelEnum,
    CountryCodeEnum,
    ExperienceEnum,
    TimePerDayEnum,
    ContentKindEnum
} from "@/enums.tsx";
import { subYears } from 'date-fns';
import { isPossiblePhoneNumber } from "react-phone-number-input";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const VALID_FILE_TYPES = ['image/png', 'image/jpeg'];

export const createSchema = (t: (key: string) => string): Step[] => {

    return [
        {
            title: t("step1.title"),
            description: t("step1.description"),
            fields: [
                {
                    label: t('firstname.label'),
                    name: 'firstname',
                    description: t('firstname.description'),
                    placeholder: t('firstname.placeholder'),
                    rules: z.string().min(1, t('firstname.rules.required')).max(64, t('firstname.rules.maxlength')),
                    minLength: 1,
                    maxLength: 64,
                },
                {
                    label: t('lastname.label'),
                    name: 'lastname',
                    description: t('lastname.description'),
                    placeholder: t('lastname.placeholder'),
                    rules: z.string().min(1, t('lastname.rules.required')).max(64, t('lastname.rules.maxlength')),
                    minLength: 1,
                    maxLength: 64,
                },
                {
                    label: t('birthdate.label'),
                    name: 'birthdate',
                    description: t('birthdate.description'),
                    as: 'birthdate',
                    minDate: subYears(new Date(), 40),
                    maxDate: subYears(new Date(), 18),
                    rules: z.date({message: t('birthdate.rules.required')}).min(subYears(new Date(), 40), t('birthdate.rules.min')).max(subYears(new Date(), 18), t('birthdate.rules.max')),
                },
                {
                    label: t('nationality.label'),
                    name: 'nationality',
                    description: t('nationality.description'),
                    as: 'combobox',
                    placeholder: t(`nationality.placeholder`),
                    options: Object.keys(CountryCodeEnum).map(key => ({
                        value: key,
                        label: t(`CountryCodeEnum.${key}`),
                        flag: key,
                    })),
                    rules: z.nativeEnum(CountryCodeEnum, {message: t('nationality.rules.required')}),
                },
            ]
        },
        {
            title: t("step2.title"),
            description: t("step2.description"),
            fields: [
                /*{
                    label: t('address1.label'),
                    name: 'address1',
                    description: t('address1.description'),
                    placeholder: t('address1.placeholder'),
                    rules: z.string().min(1, t('address1.rules.required')).max(256, t('address1.rules.maxlength')),
                    minLength: 1,
                    maxLength: 256,
                },*/
                {
                    label: t('city.label'),
                    name: 'city',
                    description: t('city.description'),
                    placeholder: t('city.placeholder'),
                    rules: z.string().min(1, t('city.rules.required')).max(64, t('city.rules.maxlength')),
                    minLength: 1,
                    maxLength: 64,
                },
                /*{
                    label: t('zip_code.label'),
                    name: 'zip_code',
                    description: t('zip_code.description'),
                    placeholder: t('zip_code.placeholder'),
                    rules: z.string().min(1, t('zip_code.rules.required')),
                    default: '',
                },*/
                {
                    label: t('country.label'),
                    name: 'country',
                    description: t('country.description'),
                    as: 'combobox',
                    placeholder: t(`country.placeholder`),
                    options: Object.keys(CountryCodeEnum).map(key => ({
                        value: key,
                        label: t(`CountryCodeEnum.${key}`),
                        flag: key,
                    })),
                    rules: z.nativeEnum(CountryCodeEnum, {message: t('country.rules.required')}),
                },
            ]
        },
        {
            title: t("step3.title"),
            description: t("step3.description"),
            fields: [
                {
                    label: t('whatsapp.label'),
                    name: 'whatsapp',
                    description: t('whatsapp.description'),
                    placeholder: t('whatsapp.placeholder'),
                    as: 'phone',
                    rules: z.string({message: t("whatsapp.rules.invalid")})
                        .refine((phone: string) => isPossiblePhoneNumber(phone), t("whatsapp.rules.invalid")),
                },
                {
                    label: t('email.label'),
                    name: 'email',
                    description: t('email.description'),
                    placeholder: t('email.placeholder'),
                    rules: z.string().email({ message: t(`email.rules.invalid`) }),
                },
                ...Object.keys(ContactNameEnum).filter(k => ['INSTAGRAM'].includes(k)).map(key => ({
                    label: t(`${key.toLowerCase()}.label`),
                    name: `${key.toLowerCase()}`,
                    description: t(`${key.toLowerCase()}.description`),
                    placeholder: t(`${key.toLowerCase()}.placeholder`),
                    rules: z.string().regex(
                        ContactValidationRegex[key as keyof typeof ContactValidationRegex],
                        t(`${key.toLowerCase()}.rules.regex`)
                    ),
                })),
                {
                    label: t('has_telegram.label'),
                    name: 'has_telegram',
                    description: t('has_telegram.description'),
                    as: 'checkbox',
                    rules: z.boolean(),
                    default: true,
                },
                {
                    label: t('telegram.label'),
                    name: 'telegram',
                    description: t('telegram.description'),
                    placeholder: t('telegram.placeholder'),
                    rules: z.string().regex(ContactValidationRegex['TELEGRAM'], { message: t(`telegram.rules.regex`) }),
                    dependsOn: 'has_telegram',
                    condition: true
                },
            ]
        },
        {
            title: t("step4.title"),
            description: t("step4.description"),
            fields: [
                {
                    label: t('experience.label'),
                    name: 'experience',
                    description: t('experience.description'),
                    as: 'select',
                    placeholder: t('experience.placeholder'),
                    options: Object.keys(ExperienceEnum).map(key => ({
                        value: key,
                        label: t(`ExperienceEnum.${key}`),
                    })),
                    rules: z.nativeEnum(ExperienceEnum, {message: t('experience.rules.required')}),
                },
                {
                    label: t('english_level.label'),
                    name: 'english_level',
                    description: t('english_level.description'),
                    as: 'select',
                    placeholder: t('english_level.placeholder'),
                    options: Object.keys(EnglishLevelEnum).map(key => ({
                        value: key,
                        label: t(`EnglishLevelEnum.${key}`),
                    })),
                    rules: z.nativeEnum(EnglishLevelEnum, {message: t('english_level.rules.required')}),
                },
                {
                    label: t('hardware.label'),
                    name: 'hardware',
                    description: t('hardware.description'),
                    placeholder: t('hardware.placeholder'),
                    rules: z.string().min(1, t('hardware.rules.required')),
                },
            ]
        },
        {
            title: t("step5.title"),
            description: t("step5.description"),
            fields: [
                {
                    label: t('comfortable_with_videos.label'),
                    name: 'comfortable_with_videos',
                    description: t('comfortable_with_videos.description'),
                    as: 'switch',
                    rules: z.coerce.boolean(),
                    default: false,
                },
                {
                    label: t('promote_on_social_media.label'),
                    name: 'promote_on_social_media',
                    description: t('promote_on_social_media.description'),
                    as: 'switch',
                    rules: z.coerce.boolean(),
                    default: false,
                },
                {
                    label: t('time_per_day.label'),
                    name: 'time_per_day',
                    description: t('time_per_day.description'),
                    as: 'select',
                    placeholder: t('time_per_day.placeholder'),
                    options: Object.keys(TimePerDayEnum).map(key => ({
                        value: key,
                        label: t(`TimePerDayEnum.${key}`),
                    })),
                    rules: z.nativeEnum(TimePerDayEnum, {message: t('time_per_day.rules.required')}),
                },
                {
                    label: t('planned_content.label'),
                    name: 'planned_content',
                    description: t('planned_content.description'),
                    as: 'multicheckbox',
                    options: Object.keys(ContentKindEnum).map(key => ({
                        value: key,
                        label: t(`ContentKindEnum.${key}`),
                    })),
                    rules: z.array(z.nativeEnum(ContentKindEnum), {
                        message: t('planned_content.rules.min'),
                    }).min(3, { message: t('planned_content.rules.min') }),
                },
                {
                    label: t('existing_content.label'),
                    name: 'existing_content',
                    description: t('existing_content.description'),
                    as: 'multicheckbox',
                    options: Object.keys(ContentKindEnum).map(key => ({
                        value: key,
                        label: t(`ContentKindEnum.${key}`),
                    })),
                    rules: z.array(z.nativeEnum(ContentKindEnum), {
                        message: t('existing_content.rules.min'),
                    }).min(2, { message: t('existing_content.rules.min') }),
                },
            ]
        },
        {
            title: t("step6.title"),
            description: t("step6.description"),
            fields: [
                {
                    label: t('country_blocked.label'),
                    name: 'country_blocked',
                    description: t('country_blocked.description'),
                    as: 'switch',
                    rules: z.coerce.boolean(),
                    default: false,
                },
                {
                    label: t('has_onlyfans.label'),
                    name: 'has_onlyfans',
                    description: t('has_onlyfans.description'),
                    as: 'checkbox',
                    rules: z.boolean(),
                    default: false,
                },
                {
                    label: t('username.label'),
                    name: 'username',
                    description: t('username.description'),
                    placeholder: t('username.placeholder'),
                    // rules: z.string().min(1, t('username.rules.required')),
                    rules: z.string().min(1, t('username.rules.required'))
                      .regex(/^(?=.{5,24}$)(?!.*[-._]{2})[a-zA-Z0-9-._]+$/, t('username.rules.invalid')),
                    default: '',
                    dependsOn: 'has_onlyfans',
                    condition: true
                },
                {
                    label: t('is_verified.label'),
                    name: 'is_verified',
                    description: t('is_verified.description'),
                    as: 'checkbox',
                    rules: z.boolean(),
                    default: false,
                    dependsOn: 'has_onlyfans',
                    condition: true
                },
                {
                    label: t('is_paid.label'),
                    name: 'is_paid',
                    description: t('is_paid.description'),
                    as: 'checkbox',
                    rules: z.boolean(),
                    default: false,
                    dependsOn: 'has_onlyfans',
                    condition: true
                },
                {
                    label: t('follower_count.label'),
                    name: 'follower_count',
                    description: t('follower_count.description'),
                    placeholder: t('follower_count.placeholder'),
                    type: 'number',
                    rules: z.string().min(1, t('follower_count.rules.required'))
                      .pipe(z.coerce.number().gte(0, { message: t('follower_count.rules.invalid') })),
                    dependsOn: 'has_onlyfans',
                    condition: true
                },
                {
                    label: t('monthly_income.label'),
                    name: 'monthly_income',
                    description: t('monthly_income.description'),
                    placeholder: t('monthly_income.placeholder'),
                    type: 'number',
                    rules: z.string().min(1, t('monthly_income.rules.required'))
                      .pipe(z.coerce.number().gte(0, { message: t('monthly_income.rules.invalid') })),
                    dependsOn: 'has_onlyfans',
                    condition: true
                },
            ]
        },
        {
            title: t("step7.title"),
            description: t("step7.description"),
            fields: [
                {
                    label: t("photos.label"),
                    name: "photos",
                    description: t("photos.description"),
                    as: "file",
                    accept: VALID_FILE_TYPES.join(', '),
                    rules: z.instanceof(FileList, { message: t("photos.rules.required") })
                        .refine((files) => files.length >= 5,{ message: t("photos.rules.min_files") })
                        .refine((files) => files.length <= 10,{ message: t("photos.rules.max_files") })
                        .refine((files) => Array.from(files).every(file => VALID_FILE_TYPES.includes(file.type)), { message: t("photos.rules.file_type") })
                        .refine((files) => Array.from(files).every(file => file.size <= MAX_FILE_SIZE), { message: t("photos.rules.file_size") }),
                    default: undefined
                },
                {
                    label: t('applicant_notes.label'),
                    name: 'applicant_notes',
                    description: t('applicant_notes.description'),
                    as: 'textarea',
                    rules: z.string().max(5000, t('applicant_notes.rules.maxlength')).optional(),
                },
                {
                    label: t('terms_accepted.label'),
                    name: 'terms_accepted',
                    description: t('terms_accepted.description'),
                    as: 'checkbox',
                    rules: z.literal(true, { errorMap: () => ({ message: t('terms_accepted.rules.required')}) }),
                    default: false,
                }
            ]
        }
    ];
};

export default createSchema;
