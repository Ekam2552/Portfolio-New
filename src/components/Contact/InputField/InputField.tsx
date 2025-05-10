import React, { useEffect } from "react";
import "./InputField.scss";

type InputFieldProps = {
  label: string;
  type: "input" | "textarea" | "cards";
  placeholder?: string;
  inputType?: string; // For HTML input types like text, email, etc.
  options?: string[]; // For card options
  onChange?: (value: string | string[]) => void;
  value?: string | string[];
  error?: string | null; // Add error prop
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder = "",
  inputType = "text",
  options = [],
  onChange,
  value,
  error, // Add error prop
}) => {
  const [selectedCards, setSelectedCards] = React.useState<string[]>(
    Array.isArray(value) ? value : []
  );

  useEffect(() => {
    if (Array.isArray(value)) {
      setSelectedCards(value);
    }
  }, [value]);

  const handleCardClick = (option: string) => {
    const newSelectedCards = selectedCards.includes(option)
      ? selectedCards.filter((card) => card !== option)
      : [...selectedCards, option];

    setSelectedCards(newSelectedCards);
    onChange?.(newSelectedCards);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`input-field ${error ? "has-error" : ""}`}>
      <h3>{label}</h3>

      <div className="input-container">
        {type === "input" && (
          <input
            type={inputType}
            placeholder={placeholder}
            value={value as string}
            onChange={handleInputChange}
            className={error ? "error" : ""}
          />
        )}

        {type === "textarea" && (
          <textarea
            placeholder={placeholder}
            value={value as string}
            onChange={handleInputChange}
            className={error ? "error" : ""}
          ></textarea>
        )}

        {type === "cards" && (
          <div className={`cards ${error ? "error" : ""}`}>
            {options.map((option) => (
              <div
                key={option}
                className={`card ${
                  selectedCards.includes(option) ? "selected" : ""
                }`}
                onClick={() => handleCardClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  );
};

export default InputField;
