export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Only POST", { status: 405 });
    }

    const formData = await request.formData();

    const audio = formData.get("audio");
    const artwork = formData.get("artwork");

    if (!audio || !artwork) {
      return new Response("Missing files", { status: 400 });
    }

    const audioKey = `audio/${Date.now()}-${audio.name}`;
    const artworkKey = `artwork/${Date.now()}-${artwork.name}`;

    await env.R2.put(audioKey, audio.stream());
    await env.R2.put(artworkKey, artwork.stream());

    await fetch(env.GSHEET_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        releaseTitle: formData.get("releaseTitle"),
        artist: formData.get("artist"),
        genre: formData.get("genre"),
        language: formData.get("language"),
        audio: audioKey,
        artwork: artworkKey
      })
    });

    return Response.json({ success: true });
  }
};

