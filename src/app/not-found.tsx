export default function NotFound() {
  // Using a completely self-contained component with inline styles
  // No dependencies on layout components that use session
  return (
    <html lang="en">
      <head>
        <title>404 - Page Not Found</title>
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
            }}>404 - Page Not Found</h2>
            <p style={{
              color: '#6b7280',
              marginBottom: '1.5rem'
            }}>
              The page you're looking for doesn't exist or has been moved.
            </p>
            <a 
              href="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                backgroundColor: '#0284c7',
                color: 'white',
                height: '2.5rem',
                paddingLeft: '1rem',
                paddingRight: '1rem',
                textDecoration: 'none'
              }}
            >
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
} 