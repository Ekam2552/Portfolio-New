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
};

const InputField: React.FC<InputFieldProps> = ({
  label,
  type,
  placeholder = "",
  inputType = "text",
  options = [],
  onChange,
  value,
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
    <div className="input-field">
      <h3>{label}</h3>

      {type === "input" && (
        <input
          type={inputType}
          placeholder={placeholder}
          value={value as string}
          onChange={handleInputChange}
        />
      )}

      {type === "textarea" && (
        <textarea
          placeholder={placeholder}
          value={value as string}
          onChange={handleInputChange}
        ></textarea>
      )}

      {type === "cards" && (
        <div className="cards">
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
    </div>
  );
};

export default InputField;
