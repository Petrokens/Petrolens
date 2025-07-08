import * as React from "react";

const Label = ({ htmlFor, className, children }) => {
  return (
    <label htmlFor={htmlFor} className={`block text-sm font-medium mb-1 ${className}`}>
      {children}
    </label>
  );
};

export { Label };
