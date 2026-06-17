"use client"

export default function VoiceRecorder() {
  async function record() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const audioContext = new AudioContext()
    const source = audioContext.createMediaStreamSource(stream)
    console.log("Voice stream active", source)
  }

  return (
    <div style={{ marginTop: 20, padding: 10, border: '1px solid #16213e' }}>
      <button onClick={record}>Start Voice Field</button>
    </div>
  )
}
