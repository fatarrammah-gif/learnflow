// SettingsPage — tells users where to configure their API keys
// API keys live in the backend .env file, not in the frontend
export function SettingsPage() {
  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <div className="rounded-lg border p-5 space-y-3">
        <h2 className="font-medium">API Configuration</h2>
        <p className="text-sm text-muted-foreground">
          API keys are configured via environment variables in the backend{" "}
          <code className="bg-muted px-1 rounded">.env</code> file. Copy{" "}
          <code className="bg-muted px-1 rounded">.env.example</code> to{" "}
          <code className="bg-muted px-1 rounded">.env</code> and fill in your keys.
        </p>
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <code className="text-xs">ANTHROPIC_API_KEY</code> — for roadmap generation
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <code className="text-xs">GEMINI_API_KEY</code> — for transcript analysis
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <code className="text-xs">YOUTUBE_API_KEY</code> — for video search (create at console.cloud.google.com)
          </div>
        </div>
      </div>
    </div>
  );
}
