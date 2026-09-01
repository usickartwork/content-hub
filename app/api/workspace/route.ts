import { NextResponse } from 'next/server';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyjgWcJUMcBS7vSfo6gOZcjZ8t64lrp5_OG105R3KS8WPdffZfn6wijPXwSbxq0bedz/exec';

export async function GET() {
  try {
    const res = await fetch(SCRIPT_URL, { 
      method: 'GET',
      redirect: 'follow',
      cache: 'no-store' 
    });
    
    const textData = await res.text();
    const data = JSON.parse(textData);
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.toString() }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Pastikan jika status baru kosong atau masih berupa teks umum, diset ke tahap pertama workflow
    if (body.newRowData && body.newRowData[6]) {
      const st = String(body.newRowData[6]).trim().toLowerCase();
      if (st.includes('planned') || st === '' || st === 'not started') {
        body.newRowData[6] = '1. Concept, Brief & Schedule (Planner & Admin)';
      }
    }

    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: 'follow',
    });
    
    const textData = await response.text();
    const result = JSON.parse(textData);
    
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.toString() }, { status: 500 });
  }
}