"use client";

import { cn } from "@/lib/utils";
import { ConfiguratorOptions } from "@/types";
import useConfigurator from "@/hooks/use-configurator";

import StyleStep from "@/components/configurator/steps/style-step";
import DimensionsStep from "@/components/configurator/steps/dimensions-step";
import ColorStep from "@/components/configurator/steps/color-step";
import VentilationStep from "@/components/configurator/steps/ventilation-step";
import MountingStep from "@/components/configurator/steps/mounting-step";
import SectionsStep from "@/components/configurator/steps/sections-step";
import AccessoriesStep from "@/components/configurator/steps/accessories-step";
import SummaryStep from "@/components/configurator/steps/summary-step";

interface ConfiguratorPanelProps {
    options: ConfiguratorOptions;
}

const STEP_LABELS = [
    "Stil",
    "Dimensiuni",
    "Culoare",
    "Ventilație",
    "Montare",
    "Secțiuni",
    "Accesorii",
    "Sumar",
];

const TOTAL_STEPS = STEP_LABELS.length;

const ConfiguratorPanel: React.FC<ConfiguratorPanelProps> = ({ options }) => {
    const { currentStep, setStep, nextStep, prevStep } = useConfigurator();

    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === TOTAL_STEPS - 1;

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return <StyleStep styles={options.styles} />;
            case 1:
                return <DimensionsStep />;
            case 2:
                return <ColorStep colors={options.colors} />;
            case 3:
                return (
                    <VentilationStep
                        patterns={options.ventilationPatterns}
                    />
                );
            case 4:
                return <MountingStep types={options.mountingTypes} />;
            case 5:
                return <SectionsStep />;
            case 6:
                return (
                    <AccessoriesStep accessories={options.accessories} />
                );
            case 7:
                return <SummaryStep options={options} />;
            default:
                return null;
        }
    };

    return (
        <div className="flex h-full flex-col">
            {/* Step indicator */}
            <div className="mb-6 flex items-center justify-between px-1">
                {STEP_LABELS.map((label, index) => {
                    const isCompleted = index < currentStep;
                    const isCurrent = index === currentStep;

                    return (
                        <div
                            key={label}
                            className="flex flex-col items-center gap-1.5"
                        >
                            <button
                                onClick={() =>
                                    isCompleted ? setStep(index) : undefined
                                }
                                disabled={!isCompleted}
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all duration-200",
                                    isCurrent &&
                                        "bg-[var(--color-accent-light)] text-[var(--th-btn-inverse-text)]",
                                    isCompleted &&
                                        "cursor-pointer border-2 border-[var(--color-accent-light)] text-[var(--color-accent-light)] hover:bg-[var(--color-accent-light)] hover:text-[var(--th-btn-inverse-text)]",
                                    !isCurrent &&
                                        !isCompleted &&
                                        "border border-[var(--th-border-strong)] text-[var(--th-text-muted)]"
                                )}
                                style={{ fontFamily: "var(--font-barlow)" }}
                            >
                                {isCompleted ? (
                                    <svg
                                        className="h-3.5 w-3.5"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </button>
                            <span
                                className={cn(
                                    "hidden text-[10px] uppercase tracking-[0.1em] sm:block",
                                    isCurrent
                                        ? "font-medium text-[var(--color-accent-light)]"
                                        : "text-[var(--th-text-muted)]"
                                )}
                                style={{ fontFamily: "var(--font-barlow)" }}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Divider */}
            <div className="mb-6 border-t border-[var(--th-border-strong)]" />

            {/* Step content */}
            <div className="min-h-0 flex-1 overflow-y-auto">{renderStep()}</div>

            {/* Navigation buttons */}
            {!isLastStep && (
                <>
                    <div className="mt-6 border-t border-[var(--th-border-strong)]" />
                    <div className="mt-4 flex items-center justify-between">
                        <button
                            onClick={prevStep}
                            disabled={isFirstStep}
                            className={cn(
                                "px-6 py-2.5 text-sm uppercase tracking-[0.15em] transition-all duration-200",
                                isFirstStep
                                    ? "cursor-not-allowed text-[var(--th-text-muted)] opacity-50"
                                    : "border border-[var(--th-border-strong)] text-[var(--th-text-tertiary)] hover:border-[var(--th-text-muted)] hover:text-[rgb(var(--th-text))]"
                            )}
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            Înapoi
                        </button>
                        <button
                            onClick={nextStep}
                            className="bg-[var(--th-btn-inverse-bg)] px-6 py-2.5 text-sm uppercase tracking-[0.15em] text-[var(--th-btn-inverse-text)] transition-all duration-200 hover:opacity-90"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            Continuă
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ConfiguratorPanel;
