/**
 * Contact form validation utilities with regex patterns and validation functions
 */

// Regex patterns
export const validationPatterns = {
  // Name should be at least 2 characters, only letters, spaces, hyphens and apostrophes
  name: /^[a-zA-Z\s'-]{2,}$/,

  // Email basic validation pattern
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Budget should be a number
  budget: /^\d+$/,

  // Timeline should be a number
  timeline: /^\d+$/,

  // Project details should be at least 10 characters
  projectDetails: /^.{10,}$/,
};

// Error messages
export const errorMessages = {
  name: "Please enter a valid name (at least 2 characters, letters only)",
  email: "Please enter a valid email address",
  services: "Please select at least one service",
  budget: "Please enter a valid budget amount (numbers only)",
  timeline: "Please enter a valid timeline in days (numbers only)",
  projectDetails: "Please provide project details (at least 10 characters)",
};

// Validation functions
export const validateField = (
  fieldName: keyof typeof validationPatterns,
  value: string
): boolean => {
  // Skip validation if the field doesn't have a pattern
  if (!(fieldName in validationPatterns)) return true;

  // Return true if the value matches the pattern
  return validationPatterns[fieldName].test(value);
};

// Validation function for services array
export const validateServices = (services: string[]): boolean => {
  return services.length > 0;
};

// Form validation function
export const validateForm = (formData: {
  name: string;
  email: string;
  projectDetails: string;
  services: string[];
  budget: string;
  timeline: string;
}): Record<string, string | null> => {
  const errors: Record<string, string | null> = {
    name: null,
    email: null,
    services: null,
    budget: null,
    timeline: null,
    projectDetails: null,
  };

  // Validate each field
  if (!validateField("name", formData.name)) {
    errors.name = errorMessages.name;
  }

  if (!validateField("email", formData.email)) {
    errors.email = errorMessages.email;
  }

  if (!validateServices(formData.services)) {
    errors.services = errorMessages.services;
  }

  if (!validateField("budget", formData.budget)) {
    errors.budget = errorMessages.budget;
  }

  if (!validateField("timeline", formData.timeline)) {
    errors.timeline = errorMessages.timeline;
  }

  if (!validateField("projectDetails", formData.projectDetails)) {
    errors.projectDetails = errorMessages.projectDetails;
  }

  return errors;
};
