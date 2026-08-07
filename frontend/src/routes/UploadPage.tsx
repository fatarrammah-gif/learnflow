import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ROADMAP_FORMATS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { uploadsApi, type Upload } from "@/api/uploads";
import { roadmapsApi } from "@/api/roadmaps";
import { Upload as UploadIcon, Link, Trash2, Loader2 } from "lucide-react";
import type { RoadmapFormat } from "@/types/roadmap";

export function UploadPage() {
  // useParams() reads the :goalId segment from the URL (e.g. /upload/42 → goalId = "42")
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();

  // useRef() lets us trigger the hidden <input type="file"> when the user clicks the drop zone
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploads, setUploads] = useState<Upload[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<RoadmapFormat>("interactive_map");
  const [showFormatPicker, setShowFormatPicker] = useState(false);

  const gid = Number(goalId);

  // Called when the user selects a file via the file picker
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const upload = await uploadsApi.uploadFile(gid, file);
      setUploads((prev) => [...prev, upload]);
    } catch {
      alert("Upload failed. Make sure the backend is running.");
    } finally {
      setUploading(false);
      // Reset the input so the same file can be uploaded again if needed
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Called when the user adds a URL
  const handleUrlAdd = async () => {
    if (!urlInput.trim()) return;
    setUploading(true);
    try {
      const upload = await uploadsApi.uploadUrl(gid, urlInput.trim());
      setUploads((prev) => [...prev, upload]);
      setUrlInput("");
    } catch {
      alert("URL upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await uploadsApi.delete(gid, id);
    setUploads((prev) => prev.filter((u) => u.id !== id));
  };

  // Kick off AI roadmap generation and navigate to the roadmap page
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const result = await roadmapsApi.generate(gid, selectedFormat);
      navigate(`/roadmap/${result.roadmap_id}`);
    } catch {
      alert("Generation failed. Make sure the backend is running.");
      setGenerating(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">Add Inspiration (Optional)</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Upload a roadmap image, PDF, webpage, or YouTube link as inspiration for the AI.
        This step is optional — you can skip it.
      </p>

      {/* File drop zone — clicking it opens the hidden file input */}
      <div
        className="border-2 border-dashed rounded-lg p-8 text-center mb-4 cursor-pointer hover:border-primary transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <UploadIcon className="mx-auto mb-2 text-muted-foreground" size={28} />
        <p className="text-sm text-muted-foreground">Click to upload a file (PDF, image, doc)</p>
        {/* Hidden file input — triggered programmatically by the drop zone click */}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx"
          onChange={handleFileChange}
        />
      </div>

      {/* URL input row */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Link size={14} className="absolute left-3 top-3 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="Paste a YouTube link or webpage URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUrlAdd()}
          />
        </div>
        <Button variant="outline" onClick={handleUrlAdd} disabled={uploading}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : "Add"}
        </Button>
      </div>

      {/* List of uploaded references */}
      {uploads.length > 0 && (
        <div className="space-y-2 mb-6">
          <p className="text-sm font-medium">Added references ({uploads.length})</p>
          {uploads.map((u) => (
            <div key={u.id} className="flex items-center gap-2 p-2 rounded border">
              <span className="text-xs px-1.5 py-0.5 bg-muted rounded">{u.upload_type}</span>
              <span className="flex-1 text-sm truncate">{u.original_url ?? u.file_path}</span>
              <button onClick={() => handleDelete(u.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Format picker — appears when user clicks "Choose Format" */}
      {showFormatPicker && (
        <div className="mb-4 space-y-2">
          <p className="text-sm font-medium">Choose roadmap format</p>
          <div className="space-y-2">
            {ROADMAP_FORMATS.map((f) => (
              <Card
                key={f.value}
                className={cn(
                  "cursor-pointer hover:border-primary transition-all",
                  selectedFormat === f.value && "border-primary bg-primary/5"
                )}
                onClick={() => setSelectedFormat(f.value as RoadmapFormat)}
              >
                <CardContent className="p-3">
                  <div className="font-medium text-sm">{f.label}</div>
                  <div className="text-xs text-muted-foreground">{f.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {!showFormatPicker ? (
          <>
            <Button variant="outline" className="flex-1" onClick={handleGenerate} disabled={generating}>
              Skip & Generate
            </Button>
            <Button className="flex-1" onClick={() => setShowFormatPicker(true)}>
              Choose Format →
            </Button>
          </>
        ) : (
          <Button className="w-full" onClick={handleGenerate} disabled={generating}>
            {generating
              ? <><Loader2 size={14} className="animate-spin mr-2" />Generating...</>
              : "Generate Roadmap →"
            }
          </Button>
        )}
      </div>
    </div>
  );
}
