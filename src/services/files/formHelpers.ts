import { Buffer } from 'buffer'

export function createCustomFormData(value: string, boundary: string): Buffer {
  const chunks = []

  chunks.push(
    `--${boundary}\r\n`,
    'Content-Disposition: form-data; name="file"; filename="data"\r\n',
    'Content-Type: application/octet-stream\r\n\r\n',
    value,
    '\r\n',
    `--${boundary}--`,
  )

  return Buffer.from(chunks.join(''));
}

export function generateBoundary(): string {
  // This generates a 50 character boundary similar to those used by Firefox.
  // They are optimized for boyer-moore parsing.
  let boundary = '--------------------------'
  for (let i = 0; i < 24; i += 1) {
    boundary += Math.floor(Math.random() * 10).toString(16)
  }
  return boundary
}
