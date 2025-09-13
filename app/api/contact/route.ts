import { NextResponse } from 'next/server'


export async function POST(req: Request) {
  const data = await req.json().catch(() => null)
  
  // TODO: validate & send to email/webhook

  return NextResponse.json({ ok: true, received: data ?? {} })
}