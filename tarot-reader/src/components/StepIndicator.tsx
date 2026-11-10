import React from 'react'

interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  title: string
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  title,
}) => {
  const stepNumbers = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <div className="step-indicator">
      {stepNumbers.map((step) => (
        <React.Fragment key={step}>
          <div
            className={`step-indicator__dot ${
              step === currentStep
                ? 'step-indicator__dot--active'
                : step < currentStep
                ? 'step-indicator__dot--complete'
                : 'step-indicator__dot--pending'
            }`}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div
              className={`step-indicator__line ${
                step < currentStep
                  ? 'step-indicator__line--complete'
                  : 'step-indicator__line--pending'
              }`}
            />
          )}
        </React.Fragment>
      ))}
      <span className="step-indicator__title">{title}</span>
    </div>
  )
}
