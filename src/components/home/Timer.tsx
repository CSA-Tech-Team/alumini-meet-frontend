import { CountdownTimer } from "@/components/countdown-timer"
import FlippedWords from "./FlippedWords"

export default function Timer() {
  return (
    <main className="flex flex-col items-center justify-center  p-4">
      <div className="max-w-4xl w-full mx-auto text-center">
        <FlippedWords text="RECONNECT" />
        <FlippedWords text="REWIND" />
        <FlippedWords text="RELIVE" />
        <FlippedWords text="2nd August" />
        <FlippedWords text="2025" />
        <CountdownTimer targetDate="2025-08-02T00:00:00" />
      </div>
    </main>
  )
}
