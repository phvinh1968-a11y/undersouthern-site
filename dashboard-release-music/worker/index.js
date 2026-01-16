export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "*"
        }
      });
    }

    if (request.method !== "POST") {
      return new Response("OK", { status: 200 });
    }

    const formData = await request.formData();

    const audio = formData.get("audio");
    const artwork = formData.get("artwork");

    if (!audio || !artwork) {
      return new Response("Missing files", { status: 400 });
    }

    const id = crypto.randomUUID();

    await env.BUCKET.put(`audio/${id}-${audio.name}`, audio.stream(), {
      httpMetadata: { contentType: audio.type }
    });

    await env.BUCKET.put(`artwork/${id}-${artwork.name}`, artwork.stream(), {
      httpMetadata: { contentType: artwork.type }
    });

    return new Response(
      JSON.stringify({ success: true, id }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
};
