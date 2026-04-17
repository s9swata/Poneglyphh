"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  UploadCloud,
  File,
  X,
  CheckCircle,
  AlertCircle,
  ImageIcon,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Plus,
  ChevronLeft,
  Sparkles,
  Users,
  Database,
} from "lucide-react";
import { Button } from "@Poneglyph/ui/components/button";
import { Input } from "@Poneglyph/ui/components/input";
import { Label } from "@Poneglyph/ui/components/label";

type UploadStatus = "idle" | "uploading" | "success" | "error";

function PoneglyphLogo() {
  return (
    <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center shrink-0">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="1" y="1" width="5" height="5" rx="0.5" fill="white" />
        <rect x="8" y="1" width="5" height="5" rx="0.5" fill="white" />
        <rect x="1" y="8" width="5" height="5" rx="0.5" fill="white" />
        <rect x="8" y="8" width="5" height="5" rx="0.5" fill="white" />
      </svg>
    </div>
  );
}

function DatasetPreviewCard({
  title,
  description,
  publisher,
  tags,
  thumbnailUrl,
  fileCount,
}: {
  title: string;
  description: string;
  publisher: string;
  tags: string;
  thumbnailUrl: string | null;
  fileCount: number;
}) {
  const tagList = tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <div className="w-full max-w-sm bg-white border border-grey-3 rounded-xl overflow-hidden shadow-sm">
      {/* Post header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-grey-3">
        <div className="w-9 h-9 rounded-full bg-black flex items-center justify-center shrink-0">
          <PoneglyphLogo />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-black leading-tight truncate">
            {publisher || "You"}
          </p>
          <p className="text-xs text-grey-1">Contributing to Poneglyph</p>
        </div>
        <button className="text-grey-1 hover:text-black transition-colors">
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Thumbnail / media area */}
      <div className="aspect-square bg-grey-4 relative overflow-hidden">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt="Dataset thumbnail"
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center">
              <Database className="h-8 w-8 text-primary" />
            </div>
            <p className="text-sm font-medium text-grey-1">
              {fileCount > 0
                ? `${fileCount} file${fileCount > 1 ? "s" : ""} ready`
                : "Add files to preview"}
            </p>
            {fileCount > 0 && (
              <div className="flex items-center gap-1.5 bg-primary/20 rounded-full px-3 py-1">
                <Sparkles className="h-3.5 w-3.5 text-black" />
                <span className="text-xs font-medium text-black">
                  Ready to share
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action bar */}
      <div className="px-4 py-3 flex items-center gap-4">
        <Heart className="h-6 w-6 text-grey-1 hover:text-error transition-colors cursor-pointer" />
        <MessageCircle className="h-6 w-6 text-grey-1 hover:text-black transition-colors cursor-pointer" />
        <Share2 className="h-6 w-6 text-grey-1 hover:text-black transition-colors cursor-pointer" />
        <div className="ml-auto">
          <Bookmark className="h-6 w-6 text-grey-1 hover:text-black transition-colors cursor-pointer" />
        </div>
      </div>

      {/* Caption */}
      <div className="px-4 pb-4 space-y-1.5">
        <p className="text-sm font-semibold text-black leading-snug">
          {title || (
            <span className="text-grey-2 font-normal italic">Dataset title…</span>
          )}
        </p>
        {description && (
          <p className="text-xs text-grey-1 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {tagList.map((tag) => (
              <span key={tag} className="text-xs text-blue font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-xs text-grey-2 pt-0.5">
          {new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}

export default function DatasetUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [summary, setSummary] = useState("");
  const [publisher, setPublisher] = useState("");
  const [tags, setTags] = useState("");
  const moreFilesRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length > 0) setFiles((prev) => [...prev, ...dropped]);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    if (selected.length > 0) setFiles((prev) => [...prev, ...selected]);
  };
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setThumbnail(f);
    const url = URL.createObjectURL(f);
    setThumbnailUrl(url);
  };
  const handleRemoveFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));
  const handleReset = () => {
    setFiles([]);
    if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);
    setThumbnail(null);
    setThumbnailUrl(null);
    setTitle("");
    setDescription("");
    setSummary("");
    setPublisher("");
    setTags("");
    setUploadStatus("idle");
  };
  const handleUpload = () => {
    if (files.length === 0 || !title || !description) return;
    setUploadStatus("uploading");
    // TODO: replace with actual POST /api/upload multipart call
    setTimeout(() => setUploadStatus("success"), 2000);
  };

  const busy = uploadStatus === "uploading";
  const done = uploadStatus === "success";

  return (
    <div className="min-h-screen bg-grey-4 flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-grey-3">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 font-onest font-semibold text-black text-sm"
          >
            <PoneglyphLogo />
            Poneglyph
          </Link>
          <span className="text-xs font-medium text-grey-1 hidden sm:block">
            Share a Dataset
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/datasets"
              className="text-sm font-medium text-grey-1 hover:text-black transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/login"
              className="px-4 py-1.5 text-sm font-medium text-black bg-primary rounded-xl hover:bg-primary/80 transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </header>

      {/* Encouragement banner */}
      <div className="bg-black text-white py-3 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-6 text-xs flex-wrap">
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span>
              <strong className="text-primary">2,847</strong> researchers
              already contributing
            </span>
          </span>
          <span className="text-grey-2 hidden sm:block">·</span>
          <span className="flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-primary" />
            <span>
              <strong className="text-primary">14,200+</strong> datasets in the
              ecosystem
            </span>
          </span>
          <span className="text-grey-2 hidden sm:block">·</span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Every dataset shapes the future of open research
          </span>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Left: Preview panel */}
          <div className="lg:sticky lg:top-24 flex flex-col items-center gap-5 w-full lg:w-auto">
            <div className="text-center lg:text-left">
              <p className="text-xs font-medium uppercase tracking-widest text-grey-1 mb-1">
                Post preview
              </p>
              <p className="text-sm text-grey-1">
                This is how your dataset appears in the feed
              </p>
            </div>
            <DatasetPreviewCard
              title={title}
              description={description}
              publisher={publisher}
              tags={tags}
              thumbnailUrl={thumbnailUrl}
              fileCount={files.length}
            />
            {/* Social proof nudge */}
            <div className="w-full max-w-sm bg-white border border-grey-3 rounded-xl p-4 flex items-center gap-3">
              <div className="flex -space-x-2 shrink-0">
                {[
                  "/images/avatar-fatima.png",
                  "/images/avatar-priya.png",
                  "/images/avatar-lucas.png",
                ].map((src, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 rounded-full border-2 border-white bg-grey-3 overflow-hidden"
                  >
                    <Image
                      src={src}
                      alt="contributor"
                      width={28}
                      height={28}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-grey-1 leading-snug">
                <strong className="text-black">Fatima, Priya, Lucas</strong>{" "}
                and 2,844 others contributed this week
              </p>
            </div>
          </div>

          {/* Right: Form panel */}
          <div className="w-full max-w-lg bg-white border border-grey-3 rounded-xl overflow-hidden shadow-sm">
            {/* Form header */}
            <div className="px-6 pt-6 pb-4 border-b border-grey-3">
              <h1 className="text-heading-6 font-semibold font-onest text-black">
                Share your dataset
              </h1>
              <p className="text-xs text-grey-1 mt-1">
                Your contribution helps researchers worldwide. Fill in the
                details below.
              </p>
            </div>

            <div className="px-6 py-6 space-y-5">
              {/* Title */}
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-medium text-black">
                  Title <span className="text-error">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Global Weather Patterns 2023"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-background border-border rounded-xl text-sm focus-visible:ring-primary"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-medium text-black">
                  Description <span className="text-error">*</span>
                </Label>
                <textarea
                  id="description"
                  placeholder="What does this dataset contain? What can others do with it?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                />
              </div>

              {/* Summary */}
              <div className="space-y-1.5">
                <Label htmlFor="summary" className="text-xs font-medium text-black">
                  Summary
                </Label>
                <Input
                  id="summary"
                  placeholder="One-sentence hook for the feed…"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="bg-background border-border rounded-xl text-sm focus-visible:ring-primary"
                />
              </div>

              {/* Publisher + Tags */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="publisher" className="text-xs font-medium text-black">
                    Publisher
                  </Label>
                  <Input
                    id="publisher"
                    placeholder="e.g., NOAA"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    className="bg-background border-border rounded-xl text-sm focus-visible:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tags" className="text-xs font-medium text-black">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    placeholder="climate, 2023"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="bg-background border-border rounded-xl text-sm focus-visible:ring-primary"
                  />
                  <p className="text-xs text-grey-2">Comma-separated</p>
                </div>
              </div>

              {/* File upload */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-black">
                  Files <span className="text-error">*</span>
                </Label>

                {files.length === 0 ? (
                  <label
                    htmlFor="file-upload"
                    className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-xl p-8 cursor-pointer transition-colors ${
                      isDragging
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-grey-2 bg-grey-4"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="h-11 w-11 rounded-xl bg-grey-3 flex items-center justify-center">
                      <UploadCloud className="h-5 w-5 text-grey-1" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-black">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-xs text-grey-1 mt-0.5">
                        CSV, JSON, JSONL, Parquet — max 50 MB each
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".csv,.json,.jsonl,.parquet"
                    />
                  </label>
                ) : (
                  <div className="space-y-2">
                    {files.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 border border-border rounded-xl p-3 bg-grey-4"
                      >
                        <div className="h-9 w-9 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                          <File className="h-4 w-4 text-black" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-black truncate">
                            {f.name}
                          </p>
                          <p className="text-xs text-grey-1">
                            {(f.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                        {uploadStatus === "idle" && (
                          <button
                            onClick={() => handleRemoveFile(i)}
                            className="p-1.5 text-grey-1 hover:text-error transition-colors rounded-xl hover:bg-grey-3/60"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                        {busy && (
                          <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        )}
                        {uploadStatus === "success" && (
                          <CheckCircle className="h-4 w-4 text-success shrink-0" />
                        )}
                        {uploadStatus === "error" && (
                          <AlertCircle className="h-4 w-4 text-error shrink-0" />
                        )}
                      </div>
                    ))}
                    {uploadStatus === "idle" && (
                      <>
                        <button
                          type="button"
                          onClick={() => moreFilesRef.current?.click()}
                          className="text-xs text-grey-1 hover:text-black underline underline-offset-2 transition-colors"
                        >
                          + Add more files
                        </button>
                        <input
                          ref={moreFilesRef}
                          type="file"
                          multiple
                          className="hidden"
                          onChange={handleFileChange}
                          accept=".csv,.json,.jsonl,.parquet"
                        />
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-black">
                  Cover image{" "}
                  <span className="text-grey-2 font-normal">(optional)</span>
                </Label>
                {!thumbnail ? (
                  <label
                    htmlFor="thumbnail-upload"
                    className="flex items-center gap-3 border border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-grey-2 hover:bg-grey-4 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-xl bg-grey-3 flex items-center justify-center shrink-0">
                      <ImageIcon className="h-4 w-4 text-grey-1" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-black">
                        Add a cover image
                      </p>
                      <p className="text-xs text-grey-2">PNG, JPG, WebP</p>
                    </div>
                    <input
                      id="thumbnail-upload"
                      type="file"
                      className="hidden"
                      onChange={handleThumbnailChange}
                      accept="image/png,image/jpeg,image/webp"
                    />
                  </label>
                ) : (
                  <div className="flex items-center gap-3 border border-border rounded-xl p-3 bg-grey-4">
                    {thumbnailUrl && (
                      <div className="h-10 w-10 rounded-xl overflow-hidden shrink-0 bg-grey-3">
                        <Image
                          src={thumbnailUrl}
                          alt="thumb"
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-black truncate">
                        {thumbnail.name}
                      </p>
                      <p className="text-xs text-grey-1">
                        {(thumbnail.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    {uploadStatus === "idle" && (
                      <button
                        onClick={() => {
                          if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);
                          setThumbnail(null);
                          setThumbnailUrl(null);
                        }}
                        className="p-1.5 text-grey-1 hover:text-error transition-colors rounded-xl hover:bg-grey-3/60"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Status banners */}
              {uploadStatus === "success" && (
                <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-start gap-3 text-success">
                  <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Dataset shared!</p>
                    <p className="text-xs mt-0.5 text-success/80">
                      Your contribution is now part of the Poneglyph ecosystem.
                      Thank you.
                    </p>
                  </div>
                </div>
              )}
              {uploadStatus === "error" && (
                <div className="bg-error/10 border border-error/20 rounded-xl p-4 flex items-start gap-3 text-error">
                  <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Upload failed</p>
                    <p className="text-xs mt-0.5 text-error/80">
                      Something went wrong. Please try again or contact support.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer actions */}
            <div className="px-6 pb-6 pt-2 flex items-center justify-between border-t border-grey-3">
              <button
                type="button"
                onClick={handleReset}
                disabled={busy}
                className="text-sm text-grey-1 hover:text-black transition-colors disabled:opacity-40"
              >
                Discard
              </button>
              <Button
                onClick={handleUpload}
                disabled={
                  files.length === 0 || !title || !description || busy || done
                }
                className="bg-primary text-black hover:bg-primary/80 font-medium px-6 rounded-xl text-sm"
              >
                {busy ? (
                  <span className="flex items-center gap-2">
                    <span className="h-3.5 w-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Uploading…
                  </span>
                ) : done ? (
                  <span className="flex items-center gap-1.5">
                    <CheckCircle className="h-4 w-4" /> Shared
                  </span>
                ) : (
                  "Share dataset"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
