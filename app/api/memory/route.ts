import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null

export async function POST(req: Request) {
  const { memory } = await req.json()

  if (!supabase) {
    return Response.json({ success: false, error: 'Supabase not configured' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('memories')
    .insert([{ content: memory, timestamp: new Date() }])

  if (error) {
    return Response.json({ success: false, error: error.message }, { status: 400 })
  }

  return Response.json({ success: true, data })
}
