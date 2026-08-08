import { Settings as SettingsIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// SettingsPage — tells users where to configure their API keys
// API keys live in the backend .env file, not in the frontend
export function SettingsPage() {
  return (
    <div className="min-h-full p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1 font-display">
          <SettingsIcon size={12} className="text-primary" />
          Settings
        </p>
        <h1 className="text-3xl font-bold text-foreground font-display">Configuration</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">API Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            API keys are configured via environment variables in the backend{" "}
            <code className="bg-muted px-1 rounded">.env</code> file. Copy{" "}
            <code className="bg-muted px-1 rounded">.env.example</code> to{" "}
            <code className="bg-muted px-1 rounded">.env</code> and fill in your keys.
          </p>
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <code className="text-xs font-mono">ANTHROPIC_API_KEY</code>
              <span className="text-muted-foreground">— for roadmap generation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
              <code className="text-xs font-mono">GEMINI_API_KEY</code>
              <span className="text-muted-foreground">— for transcript analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
              <code className="text-xs font-mono">YOUTUBE_API_KEY</code>
              <span className="text-muted-foreground">— for video search (create at console.cloud.google.com)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
