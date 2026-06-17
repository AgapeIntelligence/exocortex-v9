import { computeFeatures } from "@/lib/dsp"

export async function POST(req: Request) {
  try {
    const { samples } = await req.json()
    const features = computeFeatures(samples)
    return Response.json({ features })
  } catch (error) {
    console.error("Voice API error:", error)
    return Response.json({ error: (error as Error).message }, { status: 500 })
  }
}
