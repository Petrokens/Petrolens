import * as React from "react";

const Button = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 ${className}`}
      {...props}
    />
  );
});

Button.displayName = "Button";

export { Button };
