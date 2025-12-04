"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import JSZip from "jszip";
import QRCode from "qrcode";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type GeneratedCode = {
  url: string;
  name: string;
  dataUrl: string;
};

const DEFAULT_SIZE = 512;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "qr-code";

const nameFromUrl = (value: string, index: number) => {
  try {
    const url = new URL(value);
    const lastSegment = url.pathname.split("/").filter(Boolean).pop();
    const hint = lastSegment || url.hostname.replace(/^www\./, "");
    return slugify(hint || `qr-${index + 1}`);
  } catch {
    return `qr-${index + 1}`;
  }
};

const dataUriToBase64 = (dataUrl: string) => dataUrl.split(",")[1] ?? "";

export default function Home() {
  const [urlsInput, setUrlsInput] = useState("");
  const [codes, setCodes] = useState<GeneratedCode[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedUrls = useMemo(
    () =>
      urlsInput
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean),
    [urlsInput],
  );

  const handleGenerate = async () => {
    if (!parsedUrls.length) {
      setError("Add at least one URL to generate QR codes.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    const nextCodes: GeneratedCode[] = [];

    for (let i = 0; i < parsedUrls.length; i += 1) {
      const url = parsedUrls[i];
      try {
        // Validate URL upfront so the user gets clear feedback.
        new URL(url);
        const dataUrl = await QRCode.toDataURL(url, {
          errorCorrectionLevel: "H",
      margin: 2,
      width: DEFAULT_SIZE,
    });

        nextCodes.push({
          url,
          name: nameFromUrl(url, i),
          dataUrl,
        });
      } catch {
        setError(
          `Unable to generate a QR code for “${url}”. Please confirm it is a valid URL.`,
        );
        setIsGenerating(false);
        return;
      }
    }

    setCodes(nextCodes);
    setIsGenerating(false);
  };

  const handleNameChange = (index: number, value: string) => {
    setCodes((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], name: value };
      return next;
    });
  };

  const downloadSingle = (code: GeneratedCode) => {
    const link = document.createElement("a");
    link.href = code.dataUrl;
    link.download = `${slugify(code.name)}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleDownloadAll = async () => {
    if (!codes.length) return;

    setIsDownloading(true);

    try {
      if (codes.length === 1) {
        downloadSingle(codes[0]);
        setIsDownloading(false);
        return;
      }

      const zip = new JSZip();
      codes.forEach((code) => {
        zip.file(
          `${slugify(code.name)}.png`,
          dataUriToBase64(code.dataUrl),
          {
            base64: true,
          },
        );
      });

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "qr-codes.zip";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Something went wrong while preparing the download.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/60">
      <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-20 pt-16">
        <header className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
          <Image
            src="/logo.webp"
            alt="QR Code Buddy logo"
            width={36}
            height={36}
            className="rounded-md"
            priority
          />
          <span className="text-foreground">QR Code Buddy</span>
        </header>

        <section className="flex flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Paste URLs, get crisp PNG QR codes.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Drop one or many links, generate high-quality PNG codes, rename
            them, then download a single file or a tidy zip.
          </p>
        </section>

        <div className="overflow-hidden rounded-2xl border border-border/70 bg-card/80 shadow-lg shadow-black/5 backdrop-blur">
          <div className="grid gap-6 border-b border-border/70 bg-card/60 px-6 py-6 sm:grid-cols-3 sm:items-center">
            <div className="sm:col-span-2">
              <Label htmlFor="urls">URLs (one per line)</Label>
              <Textarea
                id="urls"
                placeholder="https://example.com\nhttps://another.com/landing"
                value={urlsInput}
                onChange={(event) => setUrlsInput(event.target.value)}
                className="mt-3 h-36 resize-none"
              />
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Output
                </Label>
                <p className="text-sm font-medium text-foreground">
                  PNG · {DEFAULT_SIZE}px · Error correction H
                </p>
              </div>
              <Separator />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? "Generating…" : "Generate QR codes"}
              </Button>
            </div>
          </div>

          <div className="px-6 py-5">
            {error ? (
              <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {codes.length
                  ? "Rename files if you like, then download everything."
                  : "Paste links and hit generate. We will validate URLs before creating PNG codes."}
              </p>
            )}
          </div>

          {!!codes.length && (
            <>
              <Separator />
              <div className="grid gap-6 px-6 py-8 sm:grid-cols-2">
                {codes.map((code, index) => (
                  <div
                    key={`${code.url}-${index}`}
                    className="flex flex-col gap-4 rounded-xl border border-border/60 bg-card/70 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">
                          File name
                        </Label>
                        <Input
                          value={code.name}
                          onChange={(event) =>
                            handleNameChange(index, event.target.value)
                          }
                          className="mt-2"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadSingle(code)}
                      >
                        Download
                      </Button>
                    </div>
                    <div className="overflow-hidden rounded-lg border border-border/70 bg-white">
                      {/* Images are data URLs; no extra requests */}
                      <Image
                        src={code.dataUrl}
                        alt={`QR for ${code.url}`}
                        width={DEFAULT_SIZE}
                        height={DEFAULT_SIZE}
                        className="h-auto w-full rounded-lg bg-white p-4"
                        unoptimized
                      />
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {code.url}
                    </p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex flex-col gap-3 px-6 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {codes.length} file{codes.length === 1 ? "" : "s"} ready.
                  {codes.length > 1
                    ? " We will bundle them in a zip for you."
                    : " Download the PNG directly."}
                </p>
                <Button
                  onClick={handleDownloadAll}
                  disabled={isDownloading}
                  className="sm:w-auto"
                >
                  {isDownloading
                    ? "Preparing download…"
                    : codes.length === 1
                      ? "Download PNG"
                      : "Download zip"}
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
