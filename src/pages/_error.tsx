import React from 'react';

function Error({ statusCode }: { statusCode: number }) {
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
        {statusCode ? `${statusCode} - Server Error` : 'An Error Occurred'}
      </h1>
      <p style={{ marginBottom: '1.5rem', color: '#666' }}>
        {statusCode
          ? `A server error occurred.`
          : 'An error occurred on client.'}
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

Error.getInitialProps = ({ res, err }: { res: any, err: any }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 