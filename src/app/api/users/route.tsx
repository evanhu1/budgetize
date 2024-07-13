import { createClient } from "@/utils/supabase/server"

export async function POST(request: Request) {
    const supabase = createClient()
    const { username, email, id } = await request.json()

    const { data, error } = await supabase.from('users').insert([{ username, email, id }])
    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
    return new Response(JSON.stringify(data), { status: 201 })
}

export async function GET(request: Request) {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')!

    const { data, error } = await supabase.from('users').select('*').eq('id', id).limit(1)
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
    return new Response(JSON.stringify(data), { status: 200 })
  }