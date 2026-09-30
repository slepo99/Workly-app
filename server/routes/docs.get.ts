export default defineEventHandler((event) => {
  setResponseHeader(event, "Content-Type", "text/html");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Workly API</title>

        <link
          rel="stylesheet"
          href="https://unpkg.com/swagger-ui-dist/swagger-ui.css"
        >

        <style>
          /* твои текущие dark styles */

          body {
            margin: 0;
            background: #111827;
          }

          .swagger-ui {
            color: #e5e7eb;
          }

          /* ...все старые стили... */

          /* ДОБАВЬ ВОТ ЭТО В САМЫЙ НИЗ */

          .swagger-ui .opblock-summary-path,
          .swagger-ui .opblock-summary-path__deprecated {
            color: #f8fafc !important;
          }

          .swagger-ui .opblock-summary-description {
            color: #cbd5e1 !important;
          }

          .swagger-ui .opblock-tag {
            color: #f8fafc !important;
          }

          .swagger-ui .opblock-tag small {
            color: #cbd5e1 !important;
          }

          .swagger-ui .parameter__name,
          .swagger-ui .parameter__type,
          .swagger-ui .parameter__deprecated {
            color: #e2e8f0 !important;
          }

          .swagger-ui .response-col_status,
          .swagger-ui .response-col_description,
          .swagger-ui .response-col_links {
            color: #e2e8f0 !important;
          }

          .swagger-ui table thead tr th,
          .swagger-ui table thead tr td {
            color: #f8fafc !important;
          }

          .swagger-ui .model-title,
          .swagger-ui .model,
          .swagger-ui .property,
          .swagger-ui .prop-name {
            color: #e2e8f0 !important;
          }

          .swagger-ui .prop-type {
            color: #7dd3fc !important;
          }

          .swagger-ui .markdown,
          .swagger-ui .markdown p,
          .swagger-ui .renderedMarkdown,
          .swagger-ui .renderedMarkdown p {
            color: #e2e8f0 !important;
          }

          .swagger-ui .info .title {
            color: #f8fafc !important;
          }

          .swagger-ui .info,
          .swagger-ui .info p {
            color: #cbd5e1 !important;
          }
          .swagger-ui .scheme-container {
            background: #111827 !important;
            box-shadow: none !important;
          }

          .swagger-ui .opblock .opblock-section-header {
            background: #111827 !important;
            box-shadow: none !important;
          }

          .swagger-ui .opblock .opblock-section-header h4,
          .swagger-ui .opblock .opblock-section-header label {
            color: #f8fafc !important;
          }
            .swagger-ui .opblock-description-wrapper,
          .swagger-ui .opblock-external-docs-wrapper,
          .swagger-ui .opblock-title_normal {
            background: #111827 !important;
          }
            .swagger-ui .execute-wrapper,
          .swagger-ui .responses-inner {
            background: #111827 !important;
          }
          .swagger-ui .request-url {
          color: #fff
          }
          .swagger-ui .opblock-description-wrapper p{
          color: #fff
          }
          .swagger-ui .curl-command h4 {
          color: #fff
          }
          .swagger-ui .request-url h4 {
          color: #fff
          }
          .swagger-ui .responses-inner h4 {
          color: #fff
          }
          .swagger-ui .response-col_description h5 {
          color: #fff
          }
          .swagger-ui .btn  {
          color: #fff !important;
          }
          .swagger-ui .table-container {
          background: #111827 !important;
          }
          .swagger-ui .opblock-control-arrow {
          color: #fff
          }
          .swagger-ui .expand-operation {
          color: #fff
          }
          .swagger-ui .authorization__btn {
          color: #fff
          }
          .swagger-ui .tablinks {
          color: #fff !important
          }
        </style>
      </head>

      <body>
        <div id="swagger-ui"></div>

        <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js"></script>

        <script>
          window.onload = () => {
            SwaggerUIBundle({
              url: "/api-docs/openapi.json",
              dom_id: "#swagger-ui",
            })
          }
        </script>
      </body>
    </html>
  `;
});
