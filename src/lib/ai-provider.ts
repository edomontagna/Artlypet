import { GenerationMode, ImageResolution } from '@/types';

export interface AIGenerationRequest {
  mode: GenerationMode;
  style: string;
  imageBase64: string;
  imageBase642?: string; // For mix mode
  resolution: ImageResolution;
  prompt?: string;
}

export interface AIGenerationResponse {
  imageUrl: string;
  imageBase64?: string;
  metadata?: Record<string, unknown>;
}

export interface AIProvider {
  name: string;
  generate(request: AIGenerationRequest): Promise<AIGenerationResponse>;
}

function buildPrompt(mode: GenerationMode, style: string): string {
  const stylePrompts: Record<string, string> = {
    watercolor: 'delicate watercolor painting with soft transparent washes, flowing colors, and gentle blending on textured paper',
    'oil-painting': 'rich oil painting with deep saturated colors, visible impasto brushstrokes, and luminous glazing technique',
    renaissance: 'majestic Renaissance portrait in the style of Raphael and Leonardo da Vinci, with sfumato technique, classical composition, and rich drapery',
    'pop-art': 'bold vibrant Pop Art style inspired by Andy Warhol, with flat bright colors, halftone dots, and graphic outlines',
    'art-nouveau': 'elegant Art Nouveau illustration with sinuous organic lines, floral ornamental borders, and decorative motifs inspired by Alphonse Mucha',
    impressionist: 'luminous Impressionist painting with visible loose brushstrokes, vibrant light effects, and atmospheric color palette inspired by Monet',
    baroque: 'dramatic Baroque portrait with intense chiaroscuro lighting, rich dark backgrounds, ornate details, and theatrical composition inspired by Caravaggio',
    'ukiyo-e': 'traditional Japanese Ukiyo-e woodblock print with flat areas of color, bold black outlines, and elegant composition',
    'minimalist-line': 'elegant minimalist single continuous line drawing, clean and sophisticated with minimal detail on white background',
    cyberpunk: 'futuristic cyberpunk portrait with neon glow effects, holographic elements, dark atmosphere, and high-tech aesthetic',
    'vintage-photo': 'classic vintage photograph with warm sepia tones, soft vignetting, film grain texture, and nostalgic atmosphere',
    'art-deco': 'geometric Art Deco portrait with gold metallic accents, symmetrical patterns, bold lines, and 1920s glamour aesthetic',
  };

  const styleDesc = stylePrompts[style] || style;

  const modePrompts: Record<GenerationMode, string> = {
    animals: `Transform this pet photo into a stunning ${styleDesc}. Maintain the animal's unique features, expression, and personality while creating an artistic masterpiece. The result should be museum-quality art worthy of framing.`,
    humans: `Transform this portrait photo into a stunning ${styleDesc}. Maintain the person's likeness, expression, and character while creating an artistic masterpiece. The result should be museum-quality art worthy of framing.`,
    mix: `Create a stunning artistic composition combining these two subjects (human and animal) together in a ${styleDesc}. Blend them harmoniously in the scene while maintaining both subjects' recognizable features. The result should be a cohesive museum-quality artwork.`,
  };

  return modePrompts[mode];
}

class BananaNano2Provider implements AIProvider {
  name = 'banana-nano-2';

  async generate(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const apiKey = process.env.AI_PROVIDER_API_KEY;
    const baseUrl = process.env.AI_PROVIDER_BASE_URL || 'https://api.banana.dev';

    if (!apiKey) {
      throw new Error('AI provider API key not configured');
    }

    const prompt = buildPrompt(request.mode, request.style);

    const response = await fetch(`${baseUrl}/v1/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        image: request.imageBase64,
        image2: request.imageBase642,
        width: request.resolution === '2160x3054' ? 2160 : 1080,
        height: request.resolution === '2160x3054' ? 3054 : 1527,
        style: request.style,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`AI generation failed: ${error}`);
    }

    const data = await response.json();
    return {
      imageUrl: data.image_url || data.output?.image_url,
      imageBase64: data.image_base64 || data.output?.image_base64,
      metadata: data.metadata,
    };
  }
}

const providers: Record<string, AIProvider> = {
  'banana-nano-2': new BananaNano2Provider(),
};

export function getAIProvider(): AIProvider {
  const providerName = process.env.AI_PROVIDER_NAME || 'banana-nano-2';
  const provider = providers[providerName];
  if (!provider) {
    throw new Error(`Unknown AI provider: ${providerName}`);
  }
  return provider;
}

export { buildPrompt };
