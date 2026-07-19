import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const payload = await request.text()
    const fields = new URLSearchParams(payload)
    const itemName = fields.get('item_name') ?? ''

    // Route ITNs for Trolley Scout
    if (itemName.startsWith('Trolley Scout ad:')) {
      // Forward to Trolley Scout Ad ITN endpoint
      const response = await fetch('https://trolleyscout.co.za/api/payfast-ad-itn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload,
      })
      const responseText = await response.text()
      return new NextResponse(responseText, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'text/plain',
        },
      })
    } else if (itemName.startsWith('Trolley Scout')) {
      // Forward to Trolley Scout Subscription ITN endpoint
      const response = await fetch('https://trolleyscout.co.za/api/payfast-itn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: payload,
      })
      const responseText = await response.text()
      return new NextResponse(responseText, {
        status: response.status,
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'text/plain',
        },
      })
    }

    // Acknowledge receipt for any other projects not yet explicitly routed
    // Returning 200 OK ensures PayFast won't indefinitely retry unhandled ITNs
    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Error processing PayFast ITN forward:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
