import { useState } from "react";
import "./Contact.scss";
import InputField from "./InputField/InputField";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectDetails: "",
    services: [],
    budget: "",
    timeline: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (field: string, value: string | string[]) => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      // Note: You need to create an account on EmailJS and set up a service and template
      // Replace 'YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', and 'YOUR_PUBLIC_KEY' with your actual values
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
    <div className="contact">
      <h1>Tell Me About Your Vision – I'll Handle the Code & Design!</h1>

      <form onSubmit={handleSubmit}>
        <InputField
          label="Name"
          type="input"
          placeholder="Your name"
          value={formData.name}
          onChange={(value) => handleChange("name", value as string)}
        />

        <InputField
          label="Email"
          type="input"
          inputType="email"
          placeholder="Your email address"
          value={formData.email}
          onChange={(value) => handleChange("email", value as string)}
        />

        <InputField
          label="Services Required"
          type="cards"
          options={serviceOptions}
          value={formData.services}
          onChange={(value) => handleChange("services", value as string[])}
        />

        <InputField
          label="Budget"
          type="input"
          inputType="number"
          placeholder="Your budget (in USD)"
          value={formData.budget}
          onChange={(value) => handleChange("budget", value as string)}
        />

        <InputField
          label="Timeline"
          type="input"
          inputType="number"
          placeholder="Your estimated timeline (in days)"
          value={formData.timeline}
          onChange={(value) => handleChange("timeline", value as string)}
        />

        <InputField
          label="Project Details"
          type="textarea"
          placeholder="Tell me about your project"
          value={formData.projectDetails}
          onChange={(value) => handleChange("projectDetails", value as string)}
        />

        <div className="form-submit-container">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>

          {submitStatus && (
            <div
              className={`status-message ${
                submitStatus.success ? "success" : "error"
              }`}
            >
              {submitStatus.message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default Contact;
