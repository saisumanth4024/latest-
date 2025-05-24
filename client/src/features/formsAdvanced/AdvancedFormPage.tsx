import React from 'react';
import FormWizard from './components/FormWizard';
import { Metadata } from '@/components/ui/metadata';

/**
 * Advanced Form Patterns page demonstrating multi-step forms with form arrays
 * and complex validation scenarios backed by Redux for state management.
 */
const AdvancedFormPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8">
      <Metadata
        title="Advanced Form Patterns"
        description="Multi-step forms with field arrays and comprehensive validation"
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Form Patterns</h1>
        <p className="text-muted-foreground">
          This demo showcases advanced form patterns including multi-step wizards, 
          dynamic field arrays, and complex validation using react-hook-form with Zod schemas,
          all backed by Redux state management.
        </p>
      </div>
      
      <FormWizard />
    </div>
  );
};

export default AdvancedFormPage;