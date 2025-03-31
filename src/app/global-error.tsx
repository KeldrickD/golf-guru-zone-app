'use client';

import { useEffect } from 'react';

export default function GlobalError({
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

  return (
    <html lang="en">
      <head>
        <title>500 - Server Error</title>
      </head>
      <body>
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
            }}>500 - Server Error</h2>
            <p style={{
              color: '#6b7280',
              marginBottom: '1.5rem'
            }}>
              Sorry, something went wrong on our server.
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
      </body>
    </html>
  );
} 