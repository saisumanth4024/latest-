import React from 'react';
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: number;
  title: string;
}

interface WizardProgressProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

const WizardProgress: React.FC<WizardProgressProps> = ({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}) => {
  return (
    <div className="relative">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = currentStep === step.id;
          const isPrevious = index < steps.findIndex(s => s.id === currentStep);
          const isClickable = isCompleted || isActive || isPrevious || step.id === Math.min(...completedSteps.map(s => s + 1), steps.length + 1);

          return (
            <div key={step.id} className="flex flex-col items-center relative">
              <button
                onClick={() => isClickable && onStepClick(step.id)}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors relative z-10",
                  isActive 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : isCompleted 
                      ? "border-primary bg-primary text-primary-foreground" 
                      : "border-muted bg-background text-muted-foreground",
                  isClickable ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed opacity-50"
                )}
                disabled={!isClickable}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Go to step ${step.id}: ${step.title}`}
              >
                {isCompleted ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </button>
              
              <span className={cn(
                "mt-2 text-xs font-medium text-center",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
      
      {/* Progress line connecting steps */}
      <div className="absolute top-5 left-0 right-0 h-[2px] bg-muted -translate-y-1/2 z-0">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ 
            width: `${(Math.max(
              steps.findIndex(s => s.id === currentStep),
              completedSteps.length > 0 
                ? completedSteps.map(id => steps.findIndex(s => s.id === id)).reduce((a, b) => Math.max(a, b), 0) + 1 
                : 0
            ) / (steps.length - 1)) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default WizardProgress;