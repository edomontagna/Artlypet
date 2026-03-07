import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAIProvider } from '@/lib/ai-provider';
import { GenerationMode, ImageResolution } from '@/types';
import { FREE_CREDITS_PER_MONTH } from '@/config/pricing';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Check credits
    if (profile.credits <= 0) {
      return NextResponse.json(
        { error: 'No credits remaining. Please upgrade your plan.' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const image = formData.get('image') as File;
    const image2 = formData.get('image2') as File | null;
    const mode = formData.get('mode') as GenerationMode;
    const style = formData.get('style') as string;
    const resolution = (formData.get('resolution') as ImageResolution) || '1080x1527';

    if (!image || !mode || !style) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check resolution access
    if (resolution === '2160x3054' && (!profile.subscription_tier || profile.subscription_tier === 'free' || profile.subscription_tier === 'starter')) {
      return NextResponse.json(
        { error: '4K resolution requires Pro or Premium plan' },
        { status: 403 }
      );
    }

    // Convert image to base64
    const imageBuffer = await image.arrayBuffer();
    const imageBase64 = Buffer.from(imageBuffer).toString('base64');

    let imageBase642: string | undefined;
    if (image2 && mode === 'mix') {
      const image2Buffer = await image2.arrayBuffer();
      imageBase642 = Buffer.from(image2Buffer).toString('base64');
    }

    // Create generation record
    const generationId = uuidv4();

    // Upload original image to Supabase Storage
    const imagePath = `originals/${user.id}/${generationId}`;
    await supabase.storage
      .from('generations')
      .upload(imagePath, image, { contentType: image.type });

    const { data: { publicUrl: originalImageUrl } } = supabase.storage
      .from('generations')
      .getPublicUrl(imagePath);

    // Save generation record
    await supabase.from('generations').insert({
      id: generationId,
      user_id: user.id,
      mode,
      style,
      status: 'processing',
      original_image_url: originalImageUrl,
      resolution,
    });

    // Call AI provider
    try {
      const provider = getAIProvider();
      const result = await provider.generate({
        mode,
        style,
        imageBase64,
        imageBase642,
        resolution,
      });

      // Upload result image
      if (result.imageBase64) {
        const resultBuffer = Buffer.from(result.imageBase64, 'base64');
        const resultPath = `results/${user.id}/${generationId}`;
        await supabase.storage
          .from('generations')
          .upload(resultPath, resultBuffer, { contentType: 'image/png' });

        const { data: { publicUrl: resultImageUrl } } = supabase.storage
          .from('generations')
          .getPublicUrl(resultPath);

        result.imageUrl = resultImageUrl;
      }

      // Update generation record
      await supabase
        .from('generations')
        .update({
          status: 'completed',
          result_image_url: result.imageUrl,
        })
        .eq('id', generationId);

      // Deduct credit
      await supabase
        .from('profiles')
        .update({ credits: profile.credits - 1 })
        .eq('id', user.id);

      return NextResponse.json({
        id: generationId,
        imageUrl: result.imageUrl,
        creditsRemaining: profile.credits - 1,
      });
    } catch (aiError) {
      // Update generation as failed
      await supabase
        .from('generations')
        .update({ status: 'failed' })
        .eq('id', generationId);

      throw aiError;
    }
  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: 'Generation failed. Please try again.' },
      { status: 500 }
    );
  }
}
