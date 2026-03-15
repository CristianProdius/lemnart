import type { ComponentType } from "react";
import { HeroFields } from "./hero-fields";
import { ProcessFields } from "./process-fields";
import { QualityFields } from "./quality-fields";
import { TestimonialsFields } from "./testimonials-fields";
import { FAQFields } from "./faq-fields";
import { CTAFields } from "./cta-fields";

export const SECTION_FIELD_MAP: Record<
    string,
    ComponentType<{ loading: boolean }>
> = {
    hero: HeroFields,
    process: ProcessFields,
    quality: QualityFields,
    testimonials: TestimonialsFields,
    faq: FAQFields,
    cta: CTAFields,
};
