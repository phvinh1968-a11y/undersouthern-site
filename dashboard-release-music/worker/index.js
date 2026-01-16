export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response("Only POST allowed", { status: 405 });
    }

    try {
      const form = await request.formData();

      // ===== TEXT FIELDS =====
      const data = {
        title: form.get("title") || "",
        version: form.get("version") || "",
        artist: form.get("artist") || "",
        featured: form.get("featured") || "",
        composer: form.get("composer") || "",
        producer: form.get("producer") || "",
        release_type: form.get("release_type") || "",
        release_date: form.get("release_date") || "",
        genre: form.get("genre") || "",
        language: form.get("language") || "",
        lyrics: form.get("lyrics") || "",
        created_at: new Date().toISOString()
      };

      // ===== FILES =====
      const audio = form.get("audio");
      const artwork = form.get("artwork");

      if (!audio || !artwork) {
        return new Response("Missing files", { status: 400 });
      }

      const uid = crypto.randomUUID();

      const audioKey = `audio/${uid}-${audio.name}`;
      const artworkKey = `artwork/${uid}-${artwork.name}`;

      // ===== UPLOAD TO R2 =====
      await env.MUSIC_BUCKET.put(audioKey, audio.stream(), {
        httpMetadata: { contentType: audio.type }
      });

      await env.MUSIC_BUCKET.put(artworkKey, artwork.stream(), {
        httpMetadata: { contentType: artwork.type }
      });

      // ===== SAVE LINKS =====
      data.audio_path = audioKey;
      data.artwork_path = artworkKey;

      // ===== GOOGLE SHEET =====
      await fetch(env.SHEET_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
