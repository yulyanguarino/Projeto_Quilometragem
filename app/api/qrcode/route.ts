import { NextResponse } from 'next/server'
import QRCode from 'qrcode'

/**
 * GET /api/qrcode?url=...
 * Gera QR Code para URL especificada
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    
    if (!url) {
      return NextResponse.json(
        { success: false, error: 'URL é obrigatória' },
        { status: 400 }
      )
    }
    
    // Gera QR Code
    const qrCodeBuffer = await QRCode.toBuffer(url, {
      type: 'png',
      width: 300,
      margin: 2,
      errorCorrectionLevel: 'M'
    })
    
    // Retorna imagem
    return new NextResponse(qrCodeBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=86400',
      },
    })
    
  } catch (error: any) {
    console.error('Erro ao gerar QR Code:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao gerar QR Code' },
      { status: 500 }
    )
  }
}
