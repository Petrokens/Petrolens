import * as React from "react";

const Card = ({ className, children }) => (
  <div className={`border rounded-lg p-6 shadow-sm ${className}`}>{children}</div>
);

const CardContent = ({ className, children }) => (
  <div className={`mt-2 ${className}`}>{children}</div>
);

export { Card, CardContent };
