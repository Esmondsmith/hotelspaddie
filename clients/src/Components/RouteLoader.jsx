
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const RouteLoader = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000); // delay before rendering
    return () => clearTimeout(timer);
  }, [location]);

  if (loading) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(255, 255, 255, 0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2000,
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "6px solid #ddd",
            borderTop: "6px solid #00504B",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // Render children (routes) AFTER loading finishes
  return <>{children}</>;
};

export default RouteLoader;
