export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>AI Image Generator</title>
          <style>
            body { font-family: Arial; text-align: center; padding: 40px; background: #f5f5f5; }
            input, button { padding: 10px; font-size: 16px; margin: 10px; }
            img { margin-top: 20px; max-width: 100%; border: 1px solid #ccc; border-radius: 8px; }
            .download-btn { margin-top: 15px; display: inline-block; padding: 10px 20px; background: #28a745; color: #fff; border-radius: 5px; text-decoration: none; }
          </style>
        </head>
        <body>
          <h2>🖼 AI Text to Image Generator</h2>
          <form id="imageForm">
            <input type="text" id="prompt" placeholder="Enter a prompt..." required>
            <button type="submit">Generate</button>
          </form>
          <div id="output"></div>

          <script>
            const form = document.getElementById('imageForm');
            const output = document.getElementById('output');

            form.addEventListener('submit', async (e) => {
              e.preventDefault();
              const prompt = document.getElementById('prompt').value;
              output.innerHTML = '⏳ Generating image...';

              const res = await fetch("/?prompt=" + encodeURIComponent(prompt));
              const blob = await res.blob();
              const imgUrl = URL.createObjectURL(blob);

              output.innerHTML = \`
                <img src="\${imgUrl}" alt="Generated Image"/>
                <br/>
                <a href="\${imgUrl}" download="ai-image.png" class="download-btn">⬇ Download</a>
              \`;
            });
          </script>
        </body>
        </html>
      `, {
        headers: { "content-type": "text/html" },
      });
    }

    const url = new URL(request.url);
    const prompt = url.searchParams.get("prompt") || "a futuristic cityscape";

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
