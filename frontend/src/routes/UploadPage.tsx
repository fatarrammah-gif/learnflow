import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROADMAP_FORMATS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { uploadsApi, type Upload } from "@/api/uploads";
import { roadmapsApi } from "@/api/roadmaps";
import { Upload as UploadIcon, Link, Trash2, Loader2, Map, Calendar, List } from "lucide-react";
import type { RoadmapFormat } from "@/types/roadmap";

// Icon for each format option
const FORMAT_ICONS = { interactive_map: Map, schedule: Calendar, steps: List } as const;

export function UploadPage() {
  const { goalId } = useParams<{ goalId: string }>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploads, setUploads] = useState<Upload[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<RoadmapFormat>("interactive_map");
  const [dragOver, setDragOver] = useState(false);

  const gid = Number(goalId);

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
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
    <div className="min-h-full p-8 max-w-2xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>
          Step 2 of 3
        </p>
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Syne, sans-serif' }}>
          Add inspiration
        </h1>
        <p className="text-muted-foreground text-sm mt-2">
          Share a roadmap image, YouTube link, or webpage — the AI will use it as a reference. Skip if you don't have one.
        </p>
      </div>

      {/* Two-column layout: drop zone left, URL + list right */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {/* Drop zone — spans 3 columns */}
        <div
          className={cn(
            "col-span-3 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-all min-h-[180px]",
            dragOver
              ? "border-primary bg-primary/10"
              : "border-border hover:border-primary/50 hover:bg-muted/50"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            const file = e.dataTransfer.files[0];
            if (file && fileInputRef.current) {
              // Simulate file input change
              const dt = new DataTransfer();
              dt.items.add(file);
              fileInputRef.current.files = dt.files;
              fileInputRef.current.dispatchEvent(new Event("change", { bubbles: true }));
            }
          }}
        >
          {uploading ? (
            <Loader2 size={24} className="animate-spin text-primary" />
          ) : (
            <UploadIcon size={24} className="text-muted-foreground" />
          )}
          <div className="text-center px-4">
            <p className="text-sm font-medium text-foreground">Drop a file here</p>
            <p className="text-xs text-muted-foreground mt-0.5">PDF · image · doc</p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.png,.jpg,.jpeg,.gif,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>

        {/* URL input — spans 2 columns */}
        <div className="col-span-2 flex flex-col gap-3">
          <div className="flex-1 rounded-xl border border-border bg-card p-4 flex flex-col gap-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide" style={{ fontFamily: 'Syne, sans-serif' }}>
              Or paste a link
            </p>
            <div className="relative">
              <Link size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-8 text-sm"
                placeholder="youtube.com/watch?v=..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleUrlAdd()}
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleUrlAdd} disabled={uploading} className="w-full">
              Add link
            </Button>
          </div>
        </div>
      </div>

      {/* Uploaded references */}
      {uploads.length > 0 && (
        <div className="mb-8 space-y-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide" style={{ fontFamily: 'Syne, sans-serif' }}>
            References added ({uploads.length})
          </p>
          {uploads.map((u) => (
            <div key={u.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-card">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground uppercase tracking-wide font-mono">
                {u.upload_type}
              </span>
              <span className="flex-1 text-sm text-foreground truncate">{u.original_url ?? u.file_path}</span>
              <button
                onClick={() => handleDelete(u.id)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Format picker */}
      <div className="mb-8">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
          Roadmap format
        </p>
        <div className="grid grid-cols-3 gap-3">
          {ROADMAP_FORMATS.map((f) => {
            const Icon = FORMAT_ICONS[f.value as keyof typeof FORMAT_ICONS];
            const isSelected = selectedFormat === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setSelectedFormat(f.value as RoadmapFormat)}
                className={cn(
                  "flex flex-col items-start gap-2 p-4 rounded-xl border transition-all text-left",
                  isSelected
                    ? "border-primary bg-primary/10 shadow-[0_0_16px_0px_hsl(37_92%_55%/0.15)]"
                    : "border-border bg-card hover:border-primary/40 hover:bg-muted"
                )}
              >
                <Icon size={18} className={isSelected ? "text-primary" : "text-muted-foreground"} />
                <div>
                  <div className={cn("font-semibold text-sm", isSelected ? "text-primary" : "text-foreground")}>
                    {f.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-snug">{f.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Generate button */}
      <Button
        className="w-full h-12 text-base font-semibold"
        onClick={handleGenerate}
        disabled={generating}
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        {generating ? (
          <><Loader2 size={16} className="animate-spin mr-2" />Generating your roadmap...</>
        ) : (
          "Generate roadmap →"
        )}
      </Button>
    </div>
  );
}
