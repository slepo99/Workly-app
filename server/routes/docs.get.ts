export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'text/html')

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Workly API</title>
        <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css">
      </head>

      <body>
        <div id="swagger-ui"></div>

        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>

        <script>
          window.onload = () => {
            SwaggerUIBundle({
              url: '/api-docs/openapi.json',
              dom_id: '#swagger-ui',
            })
          }
        </script>
      </body>
    </html>
  `
})