"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="container-fluid py-5 px-4">
          <h2 className="h4">Something went wrong.</h2>
          <p className="text-secondary-custom">{error.message}</p>
          <button className="btn cart-button--primary" onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  );
}

