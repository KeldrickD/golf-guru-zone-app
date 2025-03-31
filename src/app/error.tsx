'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  // Using a completely self-contained component with inline styles
  // No layout dependencies that might use session
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '28rem'
      }}>
        <h2 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          marginBottom: '1rem'
        }}>Something went wrong!</h2>
        <p style={{
          color: '#6b7280',
          marginBottom: '1.5rem'
        }}>
          We apologize for the inconvenience. Please try again later.
        </p>
        <button
          onClick={reset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            backgroundColor: '#0284c7',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            height: '2.5rem',
            paddingLeft: '1rem',
            paddingRight: '1rem'
          }}
        >
          Try again
        </button>
      </div>
    </div>
  );
} 