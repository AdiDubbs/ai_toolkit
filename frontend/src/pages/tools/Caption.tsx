import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Caption: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const [dragActive, setDragActive] = React.useState(false);
  const [caption, setCaption] = React.useState<string>("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const onSelectFile = React.useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please upload an image file (png, jpg, gif, etc.)");
      return;
    }
    setError("");
    setFile(f);
    setCaption("");
    setPreview((currentPreview) => {
      if (currentPreview) URL.revokeObjectURL(currentPreview);
      return URL.createObjectURL(f);
    });
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onSelectFile(f);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onSelectFile(f);
  };

  const triggerFileDialog = () => inputRef.current?.click();

  const clearSelection = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setCaption("");
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const generateCaption = async () => {
    if (!file) return;
    setIsGenerating(true);
    setCaption("");
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/caption", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate caption.");
      }

      const data = await response.json();
      setCaption(data.caption);
    } catch (error) {
      setError("An error occurred while generating the caption.");
    } finally {
      setIsGenerating(false);
    }
  };

  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <>
      <h1 className="text-6xl md:text-7xl font-bold mb-6 text-primary-foreground leading-tight">
        Image Captioning
      </h1>

      <Card className="w-full rounded-3xl overflow-hidden bg-primary/20 p-2 shadow-inner shadow-white/10 backdrop-blur-md border border-white/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary-foreground">
            Upload an image
          </CardTitle>
          <CardDescription className="text-md text-primary-foreground">
            Drag and drop an image here, or click to browse. Then click the
            button to generate a caption.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {/* Upload / Preview Panel */}
            <div className="space-y-3">
              <div
                onClick={triggerFileDialog}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    triggerFileDialog();
                  }
                }}
                role="button"
                tabIndex={0}
                className={cn(
                  "relative flex h-96 w-full cursor-pointer items-center justify-center rounded-3xl border-2 border-dashed border-rose-300 bg-primary/10 transition-all duration-300 hover:scale-[1.02] hover:border-rose-400 hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  dragActive && "border-rose-400 bg-primary/20 ring-2 ring-primary/60"
                )}
              >
                {!preview ? (
                  <div className="text-center px-6">
                    <div className="mb-4">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-primary-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="mb-2 text-xl font-semibold text-primary-foreground">
                      Drop image here
                    </div>
                    <div className="text-sm text-primary-foreground/70 mb-4">
                      or click to browse files
                    </div>
                    <div className="text-sm text-primary-foreground/50">
                      PNG, JPG, GIF up to 10MB
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 overflow-hidden rounded-3xl">
                    {/* Blurred background */}
                    <img
                      src={preview}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 h-full w-full object-cover blur-2xl scale-110 opacity-60"
                    />
                    {/* Foreground image with better styling */}
                    <div className="relative h-full w-full flex items-center justify-center p-4">
                      <div className="relative rounded-xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl w-full h-full max-w-full max-h-full">
                        <img
                          src={preview}
                          alt={file?.name || "Uploaded image"}
                          className="w-full h-full object-contain rounded-xl transition-all duration-300 hover:scale-105"
                        />
                      </div>
                    </div>
                    {/* File info overlay */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-sky-300/40 backdrop-blur-lg rounded-2xl px-3 py-2">
                        <p className="text-white text-sm font-medium truncate">
                          {file?.name}
                        </p>
                        <p className="text-white/70 text-xs">
                          {file?.size
                            ? (file.size / 1024 / 1024).toFixed(1)
                            : "0"}{" "}
                          MB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onInputChange}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>

            {/* Caption Panel */}
            <div className="space-y-6 ml-4">
              <div className="flex items-center gap-4 w-full">
                <Button
                  variant="default"
                  className="flex-1 h-14 px-6 rounded-3xl text-lg font-semibold bg-emerald-500/80 hover:bg-emerald-500/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!file || isGenerating}
                  onClick={generateCaption}
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>Generate Caption</span>
                    </div>
                  )}
                </Button>
                <Button
                  variant="default"
                  className="flex-1 h-14 px-6 rounded-3xl text-lg font-semibold bg-rose-500/60 hover:bg-rose-500/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={clearSelection}
                  disabled={!file}
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span>Remove</span>
                  </div>
                </Button>
              </div>
              {/* Caption Display */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-primary-foreground">
                  Generated Caption
                </h3>
                <div className="p-4 rounded-3xl bg-primary-foreground/5 border border-primary/30 min-h-[160px] flex items-center transition-all duration-300 hover:scale-[1.02] hover:bg-primary-foreground/10 hover:border-primary/50">
                  {caption ? (
                    <p className="text-lg text-primary-foreground leading-relaxed">
                      {caption}
                    </p>
                  ) : (
                    <p className="text-base text-primary-foreground/50 italic">
                      Your AI-generated caption will appear here...
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default Caption;
