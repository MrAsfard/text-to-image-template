export default {
  async fetch(request, env) {
    const inputs = {
      prompt: "ভালোবাসা যদি একতরফা হয়, তাহলে সেটা কষ্টের অন্য নাম realistic image",
    };

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
