import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

// Nano Banana 2 API integration
// TODO: Adapt to actual API spec once endpoint and format are confirmed
async function callNanoBanana2(
  inputUrls: string[],
  style: string,
  mode: string
): Promise<{ imageUrl: string; image4kUrl?: string }> {
  const apiKey = process.env.NANO_BANANA_API_KEY;
  const apiUrl = process.env.NANO_BANANA_API_URL;

  if (!apiKey || !apiUrl) {
    throw new Error("Nano Banana 2 API not configured. Set NANO_BANANA_API_KEY and NANO_BANANA_API_URL.");
  }

  // Style-specific prompts for optimal results
  const stylePrompts: Record<string, string> = {
    watercolor: "Transform this into a delicate watercolor painting with soft, fluid brushstrokes, gentle color bleeding, and a dreamy atmosphere.",
    "oil-painting": "Transform this into a classical oil painting with rich, layered textures, deep colors, and visible brushwork reminiscent of the Old Masters.",
    renaissance: "Transform this into a Renaissance-style portrait with classical composition, chiaroscuro lighting, rich fabrics, and a noble, timeless quality.",
    "pop-art": "Transform this into a vibrant Pop Art portrait with bold colors, high contrast, Ben-Day dots, and a Warhol-inspired aesthetic.",
    "art-nouveau": "Transform this into an Art Nouveau illustration with elegant flowing curves, organic forms, decorative borders, and Mucha-inspired styling.",
    impressionist: "Transform this into an Impressionist painting with visible brushstrokes, emphasis on light and atmosphere, and a Monet-inspired palette.",
    baroque: "Transform this into a dramatic Baroque portrait with intense chiaroscuro, rich ornate details, and a Rembrandt-inspired mood.",
    "ukiyo-e": "Transform this into a Japanese Ukiyo-e woodblock print style with flat areas of color, bold outlines, and traditional Japanese aesthetic.",
    cyberpunk: "Transform this into a cyberpunk portrait with neon lighting, holographic accents, futuristic elements, and a glowing digital aesthetic.",
    minimalist: "Transform this into a minimalist single-line art portrait, elegant and modern, suitable for premium print.",
  };

  const prompt = stylePrompts[style] || `Transform this into a ${style} style artistic portrait.`;

  const modeInstruction =
    mode === "mix"
      ? "Seamlessly blend the two subjects (human and pet) into one unified artistic portrait."
      : mode === "pets"
        ? "Focus on the animal subject, capturing its personality and essence."
        : "Focus on the human subject, capturing their likeness with artistic flair.";

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input_images: inputUrls,
      prompt: `${prompt} ${modeInstruction}`,
      style,
      mode,
      // Adapt these fields to the actual Nano Banana 2 API specification
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Nano Banana 2 API error: ${response.status} - ${err}`);
  }

  const data = await response.json();

  // Adapt this to the actual response format
  return {
    imageUrl: data.output_url || data.image_url || data.result,
    image4kUrl: data.output_4k_url || data.image_4k_url,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, input_image_urls, style, mode, resolution } = body;

    if (!user_id || !input_image_urls?.length || !style || !mode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = getServiceClient();

    // Check user has credits
    const { data: user, error: userErr } = await supabase
      .from("users")
      .select("credits, subscription, resolution_max")
      .eq("id", user_id)
      .single();

    if (userErr || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.credits <= 0) {
      return NextResponse.json({ error: "No credits remaining" }, { status: 403 });
    }

    // Check mode access (Mix requires creator+)
    if (mode === "mix" && user.subscription === "free") {
      return NextResponse.json({ error: "Mix mode requires Creator or Pro plan" }, { status: 403 });
    }

    // Create portrait record
    const { data: portrait, error: createErr } = await supabase
      .from("portraits")
      .insert({
        user_id,
        mode,
        style,
        input_image_urls,
        resolution: user.resolution_max,
        status: "generating",
        is_watermarked: user.subscription === "free",
      })
      .select()
      .single();

    if (createErr || !portrait) {
      return NextResponse.json({ error: "Failed to create portrait record" }, { status: 500 });
    }

    try {
      // Call AI
      const result = await callNanoBanana2(input_image_urls, style, mode);

      // Update portrait with result
      await supabase
        .from("portraits")
        .update({
          output_image_url: result.imageUrl,
          output_image_4k_url: result.image4kUrl || null,
          status: "completed",
        })
        .eq("id", portrait.id);

      // Decrement credits atomically
      await supabase.rpc("decrement_credits", { uid: user_id });

      return NextResponse.json({
        portrait_id: portrait.id,
        output_url: result.imageUrl,
        status: "completed",
      });
    } catch (aiError) {
      // Mark portrait as failed
      await supabase
        .from("portraits")
        .update({ status: "failed" })
        .eq("id", portrait.id);

      return NextResponse.json(
        { error: "AI generation failed", portrait_id: portrait.id },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
