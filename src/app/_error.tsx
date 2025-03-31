'use client';

export default function CustomError({ statusCode }: { statusCode: number }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
        {statusCode === 404 ? '404 - Page Not Found' : '500 - Server Error'}
      </h1>
      <p style={{ marginBottom: '1.5rem', color: '#666' }}>
        {statusCode === 404
          ? "The page you're looking for doesn't exist or has been moved."
          : "Sorry, something went wrong on our server."}
      </p>
      <a
        href="/"
        style={{
          backgroundColor: '#0284c7',
          color: 'white',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: '500',
        }}
      >
        Return Home
      </a>
    </div>
  );
} 