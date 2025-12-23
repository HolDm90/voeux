import { ImageResponse } from 'next/og'
import { getGreetingType } from '@/lib/getGreetingType'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  const type = getGreetingType()
  const emoji = type === 'christmas' ? '🎄' : '🎆'

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {emoji}
      </div>
    ),
    { ...size }
  )
}
