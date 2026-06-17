import VoiceRecorder from "@/components/VoiceRecorder"
import FieldView from "@/components/FieldView"
import PSIView from "@/components/PSIView"

export default function Page() {
  return (
    <main style={{ padding: 20 }}>
      <h1>EXOCORTEX v9</h1>
      <VoiceRecorder />
      <FieldView />
      <PSIView />
    </main>
  )
}
