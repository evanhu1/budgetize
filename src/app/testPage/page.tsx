const TestPage = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Next.js App Router: Quick Overview</h1>
      <h2 className="text-2xl font-semibold mb-2">Key Concepts:</h2>
      <ul className="list-disc pl-6 mb-4">
        <li>App directory: The new routing system is based on the `app` directory.</li>
        <li>File-based routing: Each folder in `app` represents a route segment.</li>
        <li>Page.js: The main component for a route.</li>
        <li>Layout.js: Shared UI for multiple pages.</li>
        <li>Loading.js: Loading UI for a segment.</li>
        <li>Error.js: Error handling for a segment.</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-2">Example Structure:</h2>
      <pre className=" p-4 rounded-md mb-4">
        {`app/
  layout.js
  page.js
  about/
    page.js
  blog/
    [slug]/
      page.js`}
      </pre>

      <p className="mb-4">In this structure:</p>
      <ul className="list-disc pl-6 mb-4">
        <li>/ routes to app/page.js</li>
        <li>/about routes to app/about/page.js</li>
        <li>/blog/[slug] routes to app/blog/[slug]/page.js with dynamic segments</li>
      </ul>

      <p>The App Router provides a more intuitive and powerful way to structure your Next.js applications, with built-in support for layouts, loading states, and error handling.</p>
    </div>
  );
};

export default TestPage;