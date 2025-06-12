export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>AI Image Generator</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
            body { background: #f8f9fa; padding: 40px; }
            .container { max-width: 600px; margin: auto; }
            .spinner-border { width: 3rem; height: 3rem; }
            #output img { max-width: 100%; border-radius: 10px; margin-top: 20px; }
            .download-btn { margin-top: 15px; display: inline-block; }
          </style>
        </head>
        <body>
          <div class="container text-center">
            <h2 class="mb-4">🎨 AI Image Generator</h2>
            <form id="imageForm">
              <div class="input-group mb-3">
                <input type="text" id="prompt" class="form-control" placeholder="Enter your prompt..." required>
                <button class="btn btn-primary" type="submit">Generate</button>
              </div>
            </form>
            <div id="output"></div>
          </div>

          <script>
            const form = document.getElementById('imageForm');
            const output = document.getElementById('output');

            form.addEventListener('submit', async (e) => {
              e.preventDefault();
              const prompt = document.getElementById('prompt').value;
              output.innerHTML = \`
                <div class="d-flex justify-content-center mt-4">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Generating...</span>
                  </div>
                </div>
                <p class="mt-2 text-muted">Generating image...</p>
              \`;

              try {
                const res = await fetch("/?prompt=" + encodeURIComponent(prompt));
                const blob = await res.blob();
                const imgUrl = URL.createObjectURL(blob);

                output.innerHTML = \`
                  <img src="\${imgUrl}" alt="Generated Image"/>
                  <div>
                    <a href="\${imgUrl}" download="ai-image.png" class="btn btn-success download-btn">⬇ Download Image</a>
                  </div>
                \`;
              } catch (err) {
                output.innerHTML = '<div class="alert alert-danger mt-3">❌ Failed to generate image.</div>';
              }
            });
          </script>
        </body>
        </html>
      `, {
        headers: { "content-type": "text/html" },
      });
    }

    const url = new URL(request.url);
    const prompt = url.searchParams.get("prompt") || "a beautiful futuristic landscape";

    const inputs = { prompt };

    const response = await env.AI.run(
      "@cf/stabilityai/stable-diffusion-xl-base-1.0",
      inputs,
    );

    return new Response(response, {
      headers: {
        "content-type": "image/png",
      },
    });
  },
} satisfies ExportedHandler<Env>;
