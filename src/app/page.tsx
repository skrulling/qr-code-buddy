"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import JSZip from "jszip";
import QRCode from "qrcode";
import { QrCode, Download } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex max-w-4xl flex-col gap-16 px-8 pb-24 pt-16">
        <header className="flex items-center gap-4">
          <Image
            src="/logo.webp"
            alt="QR Code Buddy logo"
            width={44}
            height={44}
            className="rounded-lg"
            priority
          />
          <span className="text-xl font-semibold text-foreground">QR Code Buddy</span>
        </header>

        <section className="flex flex-col gap-5">
          <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Paste URLs, get crisp PNG QR codes.
          </h1>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Drop one or many links, generate high-quality PNG codes, rename
            them, then download a single file or a tidy zip.
          </p>
        </section>

        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <div>
              <Label htmlFor="urls" className="text-sm font-medium">URLs (one per line)</Label>
              <Textarea
                id="urls"
                placeholder="https://example.com&#10;https://another.com/landing"
                value={urlsInput}
                onChange={(event) => setUrlsInput(event.target.value)}
                className="mt-3 h-52 resize-none border-border bg-background"
              />
            </div>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full rounded-full sm:w-auto sm:self-center sm:px-12"
              size="lg"
            >
              <QrCode className="mr-1 h-5 w-5" />
              {isGenerating ? "Generating…" : "Generate QR codes"}
            </Button>
          </div>

          <div>
            {error ? (
              <p className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
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
              <div className="h-px bg-border" />
              <div className="grid gap-8 sm:grid-cols-2">
                {codes.map((code, index) => (
                  <div
                    key={`${code.url}-${index}`}
                    className="flex flex-col gap-6"
                  >
                    <div className="flex flex-col gap-6">
                      <div>
                        <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
                    </div>
                    <div className="overflow-hidden rounded-lg border border-border bg-white">
                      {/* Images are data URLs; no extra requests */}
                      <Image
                        src={code.dataUrl}
                        alt={`QR for ${code.url}`}
                        width={DEFAULT_SIZE}
                        height={DEFAULT_SIZE}
                        className="h-auto w-full bg-white p-6"
                        unoptimized
                      />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <p className="truncate text-xs text-muted-foreground">
                        {code.url}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadSingle(code)}
                        className="shrink-0 rounded-full"
                      >
                        <Download className="mr-1 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="h-px bg-border" />
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  {codes.length} file{codes.length === 1 ? "" : "s"} ready.
                  {codes.length > 1
                    ? " We will bundle them in a zip for you."
                    : " Download the PNG directly."}
                </p>
                <Button
                  onClick={handleDownloadAll}
                  disabled={isDownloading}
                  className="sm:w-auto rounded-full"
                  size="lg"
                >
                  <Download className="mr-1 h-5 w-5" />
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
