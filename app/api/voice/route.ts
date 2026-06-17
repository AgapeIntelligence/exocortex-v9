import { computeFeatures } from "@/lib/dsp"
import { createPSI } from "@/lib/psi"

export async function POST(req: Request) {
  const { samples } = await req.json()
  const features = computeFeatures(samples)
  const psi = createPSI(features)
  return Response.json({ features, psi })
}
