// schema.json.tsx
import { subYears } from 'date-fns';
import {
  CountryCodeEnum,
  ExperienceEnum,
  EnglishLevelEnum,
  TimePerDayEnum,
  ContentKindEnum,
  ContactValidationRegex
} from "@/enums.tsx";

const VALID_FILE_TYPES = ['image/png', 'image/jpeg'];

export const getJsonSchema = (t: (key: string) => string) => {
  return {
    type: "object",
    properties: {
      // Step 1
      firstname: {
        type: "string",
        title: t("firstname.label"),
        minLength: 1,
        maxLength: 64
        
      },
      lastname: {
        type: "string",
        title: t("lastname.label"),
        minLength: 1,
        maxLength: 64
      },
      birthdate: {
        type: "string",
        format: "date",
        title: t("birthdate.label"),
        minimum: subYears(new Date(), 40).toISOString().split('T')[0],
        maximum: subYears(new Date(), 18).toISOString().split('T')[0]
      },
      nationality: {
        type: "string",
        title: t("nationality.label"),
        enum: Object.keys(CountryCodeEnum),
        enumNames: Object.keys(CountryCodeEnum).map(key => t(`CountryCodeEnum.${key}`))
      },

      // Step 2
      city: {
        type: "string",
        title: t("city.label"),
        minLength: 1,
        maxLength: 64
      },
      country: {
        type: "string",
        title: t("country.label"),
        enum: Object.keys(CountryCodeEnum),
        enumNames: Object.keys(CountryCodeEnum).map(key => t(`CountryCodeEnum.${key}`))
      },

      // Step 3
      whatsapp: {
        type: "string",
        title: t("whatsapp.label"),
        pattern: "^[+]{1}[0-9]{10,15}$" // Exemple de regex pour un numéro de téléphone
      },
      email: {
        type: "string",
        format: "email",
        title: t("email.label")
      },
      instagram: {
        type: "string",
        title: t("instagram.label"),
        pattern: ContactValidationRegex['INSTAGRAM'].toString()
      },
      has_telegram: {
        type: "boolean",
        title: t("has_telegram.label"),
        default: true
      },
      telegram: {
        type: "string",
        title: t("telegram.label"),
        pattern: ContactValidationRegex['TELEGRAM'].toString()
      },

      // Step 4
      experience: {
        type: "string",
        title: t("experience.label"),
        enum: Object.keys(ExperienceEnum),
        enumNames: Object.keys(ExperienceEnum).map(key => t(`ExperienceEnum.${key}`))
      },
      english_level: {
        type: "string",
        title: t("english_level.label"),
        enum: Object.keys(EnglishLevelEnum),
        enumNames: Object.keys(EnglishLevelEnum).map(key => t(`EnglishLevelEnum.${key}`))
      },
      hardware: {
        type: "string",
        title: t("hardware.label"),
        minLength: 1
      },

      // Step 5
      comfortable_with_videos: {
        type: "boolean",
        title: t("comfortable_with_videos.label"),
        default: false
      },
      promote_on_social_media: {
        type: "boolean",
        title: t("promote_on_social_media.label"),
        default: false
      },
      time_per_day: {
        type: "string",
        title: t("time_per_day.label"),
        enum: Object.keys(TimePerDayEnum),
        enumNames: Object.keys(TimePerDayEnum).map(key => t(`TimePerDayEnum.${key}`))
      },
      planned_content: {
        type: "array",
        title: t("planned_content.label"),
        items: {
          type: "string",
          enum: Object.keys(ContentKindEnum),
          enumNames: Object.keys(ContentKindEnum).map(key => t(`ContentKindEnum.${key}`))
        },
        minItems: 3,
        uniqueItems: true
      },
      existing_content: {
        type: "array",
        title: t("existing_content.label"),
        items: {
          type: "string",
          enum: Object.keys(ContentKindEnum),
          enumNames: Object.keys(ContentKindEnum).map(key => t(`ContentKindEnum.${key}`))
        },
        minItems: 2,
        uniqueItems: true
      },

      // Step 6
      country_blocked: {
        type: "boolean",
        title: t("country_blocked.label"),
        default: false
      },
      has_onlyfans: {
        type: "boolean",
        title: t("has_onlyfans.label"),
        default: false
      },
      username: {
        type: "string",
        title: t("username.label"),
        pattern: "^(?=.{5,24}$)(?!.*[-._]{2})[a-zA-Z0-9-._]+$"
      },
      is_verified: {
        type: "boolean",
        title: t("is_verified.label"),
        default: false
      },
      is_paid: {
        type: "boolean",
        title: t("is_paid.label"),
        default: false
      },
      follower_count: {
        type: "number",
        title: t("follower_count.label"),
        minimum: 0
      },
      monthly_income: {
        type: "number",
        title: t("monthly_income.label"),
        minimum: 0
      },

      // Step 7
      photos: {
        type: "array",
        title: t("photos.label"),
        items: {
          type: "string",
          format: "data-url"
        },
        minItems: 5,
        maxItems: 10
      },
      applicant_notes: {
        type: "string",
        title: t("applicant_notes.label"),
        maxLength: 5000
      },
      terms_accepted: {
        type: "boolean",
        title: t("terms_accepted.label"),
        const: true
      }
    },
    required: [
      "firstname", "lastname", "birthdate", "nationality", "city", "country",
      "whatsapp", "email", "experience", "english_level", "hardware",
      "time_per_day", "planned_content", "existing_content", "terms_accepted"
    ],
    dependencies: {
      telegram: {
        properties: {
          has_telegram: {
            const: true
          }
        }
      },
      username: {
        properties: {
          has_onlyfans: {
            const: true
          }
        }
      },
      is_verified: {
        properties: {
          has_onlyfans: {
            const: true
          }
        }
      },
      is_paid: {
        properties: {
          has_onlyfans: {
            const: true
          }
        }
      },
      follower_count: {
        properties: {
          has_onlyfans: {
            const: true
          }
        }
      },
      monthly_income: {
        properties: {
          has_onlyfans: {
            const: true
          }
        }
      }
    }
  };
};

export const getUiSchema = (t: (key: string) => string) => {
  return {
    firstname: {
      "ui:placeholder": t("firstname.placeholder"),
      "ui:description": t("firstname.description")
    },
    lastname: {
      "ui:placeholder": t("lastname.placeholder"),
      "ui:description": t("lastname.description")
    },
    birthdate: {
      "ui:widget": "date",
      "ui:description": t("birthdate.description")
    },
    nationality: {
      "ui:widget": "select",
      "ui:description": t("nationality.description")
    },
    city: {
      "ui:placeholder": t("city.placeholder"),
      "ui:description": t("city.description")
    },
    country: {
      "ui:widget": "select",
      "ui:description": t("country.description")
    },
    whatsapp: {
      "ui:placeholder": t("whatsapp.placeholder"),
      "ui:description": t("whatsapp.description")
    },
    email: {
      "ui:placeholder": t("email.placeholder"),
      "ui:description": t("email.description")
    },
    instagram: {
      "ui:placeholder": t("instagram.placeholder"),
      "ui:description": t("instagram.description")
    },
    has_telegram: {
      "ui:widget": "checkbox",
      "ui:description": t("has_telegram.description")
    },
    telegram: {
      "ui:placeholder": t("telegram.placeholder"),
      "ui:description": t("telegram.description")
    },
    experience: {
      "ui:widget": "select",
      "ui:description": t("experience.description")
    },
    english_level: {
      "ui:widget": "select",
      "ui:description": t("english_level.description")
    },
    hardware: {
      "ui:placeholder": t("hardware.placeholder"),
      "ui:description": t("hardware.description")
    },
    comfortable_with_videos: {
      "ui:widget": "checkbox",
      "ui:description": t("comfortable_with_videos.description")
    },
    promote_on_social_media: {
      "ui:widget": "checkbox",
      "ui:description": t("promote_on_social_media.description")
    },
    time_per_day: {
      "ui:widget": "select",
      "ui:description": t("time_per_day.description")
    },
    planned_content: {
      "ui:widget": "checkboxes",
      "ui:description": t("planned_content.description")
    },
    existing_content: {
      "ui:widget": "checkboxes",
      "ui:description": t("existing_content.description")
    },
    country_blocked: {
      "ui:widget": "checkbox",
      "ui:description": t("country_blocked.description")
    },
    has_onlyfans: {
      "ui:widget": "checkbox",
      "ui:description": t("has_onlyfans.description")
    },
    username: {
      "ui:placeholder": t("username.placeholder"),
      "ui:description": t("username.description")
    },
    is_verified: {
      "ui:widget": "checkbox",
      "ui:description": t("is_verified.description")
    },
    is_paid: {
      "ui:widget": "checkbox",
      "ui:description": t("is_paid.description")
    },
    follower_count: {
      "ui:placeholder": t("follower_count.placeholder"),
      "ui:description": t("follower_count.description")
    },
    monthly_income: {
      "ui:placeholder": t("monthly_income.placeholder"),
      "ui:description": t("monthly_income.description")
    },
    photos: {
      "ui:widget": "file",
      "ui:description": t("photos.description"),
      "ui:options": {
        accept: VALID_FILE_TYPES.join(', ')
      }
    },
    applicant_notes: {
      "ui:widget": "textarea",
      "ui:description": t("applicant_notes.description")
    },
    terms_accepted: {
      "ui:widget": "checkbox",
      "ui:description": t("terms_accepted.description")
    }
  };
};