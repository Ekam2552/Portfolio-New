import { useState, useRef } from "react";
import "./Contact.scss";
import InputField from "./InputField/InputField";
import emailjs from "@emailjs/browser";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useAnimationContext } from "../../context/useAnimationContext";
import { applyCurtainRevealToElement } from "../../utils/animations/textRevealAnimations";
import { validateForm } from "./validationUtils";
import StatusModal from "./StatusModal/StatusModal";

// Register the GSAP plugin
gsap.registerPlugin(useGSAP);

const Contact = () => {
  // Create refs for the elements we want to animate
  const contactRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Get the animation context
  const { loaderComplete, timing } = useAnimationContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectDetails: "",
    services: [],
    budget: "",
    timeline: "",
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({
    name: null,
    email: null,
    services: null,
    budget: null,
    timeline: null,
    projectDetails: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Cleanup function to remove animation-related elements
  const cleanupAnimationElements = () => {
    if (!contactRef.current) return;

    // Find all text elements with reveal-text class
    const textElements = contactRef.current.querySelectorAll(".reveal-text");

    textElements.forEach((element) => {
      const el = element as HTMLElement;
      const parent = el.parentElement;

      // If wrapped in a text-reveal-wrapper, unwrap it
      if (parent?.classList.contains("text-reveal-wrapper")) {
        const grandParent = parent.parentElement;
        if (grandParent) {
          // Preserve the original margin-top
          const computedStyle = window.getComputedStyle(parent);
          el.style.marginTop = computedStyle.marginTop;

          // Unwrap the element
          grandParent.insertBefore(el, parent);
          grandParent.removeChild(parent);
        }
      }
    });
  };

  // Text reveal animation for heading
  useGSAP(
    () => {
      if (!contactRef.current || !loaderComplete || !headingRef.current) return;

      // Clean up any existing animation elements
      cleanupAnimationElements();

      // Apply curtain reveal to heading
      applyCurtainRevealToElement(headingRef.current, {
        direction: "left",
        duration: 1.5,
        ease: "power3.out",
        delay: timing.POST_LOADER_DELAY / 1000,
        curtainColor: "var(--primary-background)",
      });

      return () => {
        cleanupAnimationElements();
      };
    },
    { dependencies: [loaderComplete, timing], scope: contactRef }
  );

  // Fade-in animation for form elements
  useGSAP(
    () => {
      if (!formRef.current || !loaderComplete) return;

      // Get all input fields
      const formElements = formRef.current.querySelectorAll(".input-field");
      const submitButton = formRef.current.querySelector(
        ".form-submit-container"
      );

      // Set initial state - hidden
      gsap.set([formElements, submitButton], {
        opacity: 0,
        y: 20,
      });

      // Create staggered animation
      gsap.to(formElements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
        delay: timing.POST_LOADER_DELAY / 1000 + 0.5, // Start after heading animation
      });

      // Animate submit button after form fields
      gsap.to(submitButton, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: timing.POST_LOADER_DELAY / 1000 + 1.2, // Start after all form fields
      });
    },
    { dependencies: [loaderComplete, timing], scope: formRef }
  );

  const handleChange = (field: string, value: string | string[]) => {
    // Clear the error for this field when it changes
    setErrors({
      ...errors,
      [field]: null,
    });

    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      projectDetails: "",
      services: [],
      budget: "",
      timeline: "",
    });
    setErrors({
      name: null,
      email: null,
      services: null,
      budget: null,
      timeline: null,
      projectDetails: null,
    });
  };

  const handleCloseModal = () => {
    setSubmitStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the form
    const validationErrors = validateForm(formData);
    setErrors(validationErrors);

    // Check if there are any errors
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== null
    );

    // If there are errors, don't submit the form
    if (hasErrors) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Prepare the template parameters
      const templateParams = {
        to_name: "Ekam",
        from_name: formData.name,
        from_email: formData.email,
        projectDetails: formData.projectDetails,
        services: formData.services.join(", "),
        budget: formData.budget,
        timeline: formData.timeline,
      };

      // Send the email using EmailJS
      const response = await emailjs.send(
        import.meta.env.VITE_EMAIL_SERVICE_ID,
        import.meta.env.VITE_EMAIL_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAIL_PUBLIC_KEY
      );

      console.log("Email sent successfully:", response);
      setSubmitStatus({
        success: true,
        message: "Thank you! Your message has been sent successfully.",
      });

      // Clear the form after successful submission
      clearForm();
    } catch (error) {
      console.error("Error sending email:", error);
      setSubmitStatus({
        success: false,
        message: "Oops! Something went wrong. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const serviceOptions = [
    "UI Design",
    "UI Development",
    "Backend Development",
    "Database Management",
    "React Native Development",
    "Fullstack Development",
  ];

  return (
    <div className="contact" ref={contactRef}>
      <h1 ref={headingRef} className="reveal-text">
        Tell Me About Your Vision – I'll Handle the Code & Design!
      </h1>

      <form onSubmit={handleSubmit} ref={formRef}>
        <InputField
          label="Name"
          type="input"
          placeholder="Your name"
          value={formData.name}
          onChange={(value) => handleChange("name", value as string)}
          error={errors.name}
        />

        <InputField
          label="Email"
          type="input"
          inputType="email"
          placeholder="Your email address"
          value={formData.email}
          onChange={(value) => handleChange("email", value as string)}
          error={errors.email}
        />

        <InputField
          label="Services Required"
          type="cards"
          options={serviceOptions}
          value={formData.services}
          onChange={(value) => handleChange("services", value as string[])}
          error={errors.services}
        />

        <InputField
          label="Budget"
          type="input"
          inputType="number"
          placeholder="Your budget (in USD)"
          value={formData.budget}
          onChange={(value) => handleChange("budget", value as string)}
          error={errors.budget}
        />

        <InputField
          label="Timeline"
          type="input"
          inputType="number"
          placeholder="Your estimated timeline (in days)"
          value={formData.timeline}
          onChange={(value) => handleChange("timeline", value as string)}
          error={errors.timeline}
        />

        <InputField
          label="Project Details"
          type="textarea"
          placeholder="Tell me about your project"
          value={formData.projectDetails}
          onChange={(value) => handleChange("projectDetails", value as string)}
          error={errors.projectDetails}
        />

        <div className="form-submit-container">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </div>
      </form>

      {submitStatus && (
        <StatusModal
          success={submitStatus.success}
          message={submitStatus.message}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Contact;
