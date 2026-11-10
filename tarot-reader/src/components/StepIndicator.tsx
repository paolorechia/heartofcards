import React from 'react'

interface StepProps {
  currentStep: number
  totalSteps: number
  title: string
}

export const StepIndicator: React.FC<StepProps> = ({ currentStep, totalSteps, title }) => {
  const stepNumbers = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {stepNumbers.map((step) => (
        <React.Fragment key={step}>
          <div
            className={`rounded-full w-8 h-8 flex items-center justify-center text-sm font-semibold transition-colors ${
              step === currentStep
                ? 'bg-purple-600 text-white'
                : step < currentStep
                ? 'bg-purple-300 text-purple-800'
                : 'bg-purple-100 text-purple-300'
            }`}
          >
            {step}
          </div>
          {step < totalSteps && (
            <div className={`w-8 h-0.5 ${step < currentStep ? 'bg-purple-300' : 'bg-purple-100'}`} />
          )}
        </React.Fragment>
      ))}
      <span className="ml-3 text-sm text-purple-600 font-medium hidden sm:inline">{title}</span>
    </div>
  )
}
