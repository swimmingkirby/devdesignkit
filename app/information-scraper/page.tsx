"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Download, AlertCircle, Upload, Link as LinkIcon, ZoomIn, Combine, Palette, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { convertScraperToTheme, validateScraperOutput } from "@/lib/utils/scraper-converter";
import { CustomizerHeader } from "@/components/customizer/customizer-header";

export default function InformationScraper() {
  const router = useRouter();
  const [inputMode, setInputMode] = useState<"url" | "image" | "hybrid">("hybrid");
  const [url, setUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [themeName, setThemeName] = useState("");
  const searchParams = useSearchParams();
  const isFromWizard = searchParams.get("from") === "wizard";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScrape = async () => {
    if (!url) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to scrape URL");
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHybridScrape = async () => {
    if (!url) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("/api/hybrid-scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          options: {
            enableDOMScraping: true,
            enableVisionAI: true,
            mergeStrategy: "best-of-both",
          }
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to hybrid scrape");
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!imageFile) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);

      const response = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to analyze image");
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadArtifacts = () => {
    if (!results) return;

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "devux-artifacts.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEditInCustomizer = () => {
    if (!results) return;

    try {
      // Validate and convert the scraper output
      if (!validateScraperOutput(results)) {
        alert("Invalid scraper output format. Cannot open in customizer.");
        return;
      }

      // Generate default name from URL
      const defaultName = url ? new URL(url).hostname.replace("www.", "").split(".")[0] : "Imported Theme";
      setThemeName(defaultName.charAt(0).toUpperCase() + defaultName.slice(1));
      setShowNameDialog(true);
    } catch (error) {
      console.error("Failed to convert theme:", error);
      alert("Failed to convert theme for customizer. Check console for details.");
    }
  };

  const handleConfirmEdit = () => {
    if (!results || !themeName.trim()) return;

    try {
      const theme = convertScraperToTheme(results);

      // Store the theme AND full scraper results for component/layout extraction
      sessionStorage.setItem("importedTheme", JSON.stringify(theme));
      sessionStorage.setItem("importedThemeName", themeName.trim());
      sessionStorage.setItem("importedThemeUrl", url || "imported-theme");
      sessionStorage.setItem("scrapedData", JSON.stringify({
        components: results.components,
        layouts: results.layouts,
        tokens: results.tokens,
      }));

      if (isFromWizard) {
        // Continue wizard flow to UX settings
        router.push("/wizard/ux");
      } else {
        // Direct navigation to customizer
        router.push("/customizer");
      }
    } catch (error) {
      console.error("Failed to convert theme:", error);
      alert("Failed to convert theme for customizer. Check console for details.");
    }
  };

  return (
    <div className="min-h-screen bg-[#2C2C2C] text-white flex flex-col">
      <CustomizerHeader />
      <div className="container mx-auto py-10 px-4 flex-1">
        <div className="max-w-6xl mx-auto space-y-8">
          {isFromWizard && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/wizard/source")}
              className="gap-2 -ml-2 text-gray-400 hover:text-white hover:bg-[#333] rounded-md"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Wizard
            </Button>
          )}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight">
              {isFromWizard ? "Import from Inspiration Website" : "DevUX Scraper"}
            </h1>
            <p className="text-gray-400 text-lg">
              Extract design tokens, components, and layouts from any website.
            </p>
          </div>

          <Card className="bg-[#1E1E1E] border-[#444] rounded-none">
            <CardHeader>
              <CardTitle className="text-white">Analyze Website Design</CardTitle>
              <CardDescription className="text-gray-400">
                Extract design tokens, components, and layouts from a URL or screenshot.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "url" | "image" | "hybrid")} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4 bg-[#252525] rounded-none">
                  <TabsTrigger value="hybrid" className="data-[state=active]:bg-[#333] data-[state=active]:text-white rounded-none">
                    <Combine className="mr-2 h-4 w-4" />
                    Hybrid (Best)
                  </TabsTrigger>
                  <TabsTrigger value="url" className="data-[state=active]:bg-[#333] data-[state=active]:text-white rounded-none">
                    <LinkIcon className="mr-2 h-4 w-4" />
                    DOM Only
                  </TabsTrigger>
                  <TabsTrigger value="image" className="data-[state=active]:bg-[#333] data-[state=active]:text-white rounded-none">
                    <Upload className="mr-2 h-4 w-4" />
                    Vision AI Only
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="hybrid" className="space-y-4 mt-0">
                  <div className="flex gap-4">
                    <Input
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleHybridScrape()}
                      disabled={loading}
                      className="flex-1 bg-[#252525] border-[#444] text-white rounded-none focus-visible:ring-blue-500"
                    />
                    <Button onClick={handleHybridScrape} disabled={loading || !url} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing
                        </>
                      ) : (
                        "Analyze URL"
                      )}
                    </Button>
                  </div>
                  <div className="rounded-none bg-blue-500/10 border border-blue-500/20 p-4">
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2 text-blue-400">
                      <Combine className="h-4 w-4" />
                      Hybrid Approach (Recommended)
                    </h4>
                    <p className="text-sm text-gray-400 mb-2">
                      Combines DOM scraping with AI vision for the most comprehensive analysis:
                    </p>
                    <ul className="text-sm text-gray-400 space-y-1 ml-4">
                      <li>✓ Precise CSS values from DOM inspection</li>
                      <li>✓ Visual layout understanding from AI</li>
                      <li>✓ Intelligent merging of both approaches</li>
                      <li>✓ Best accuracy and completeness</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="url" className="space-y-4 mt-0">
                  <div className="flex gap-4">
                    <Input
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                      disabled={loading}
                      className="flex-1 bg-[#252525] border-[#444] text-white rounded-none focus-visible:ring-blue-500"
                    />
                    <Button onClick={handleScrape} disabled={loading || !url} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing
                        </>
                      ) : (
                        "Analyze URL"
                      )}
                    </Button>
                  </div>
                  <p className="text-sm text-gray-400">
                    DOM-only scraping: Most accurate for CSS values, no AI needed.
                  </p>
                </TabsContent>

                <TabsContent value="image" className="space-y-4 mt-0">
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={loading}
                          className="cursor-pointer bg-[#252525] border-[#444] text-white rounded-none file:text-white file:bg-[#333] file:border-0 file:rounded-none"
                        />
                      </div>
                      <Button
                        onClick={handleAnalyzeImage}
                        disabled={loading || !imageFile}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing
                          </>
                        ) : (
                          "Analyze Image"
                        )}
                      </Button>
                    </div>

                    {imagePreview && (
                      <div className="border border-[#444] rounded-none p-4 bg-[#252525]">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm font-medium text-gray-200">Preview:</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-[#333]">
                                <ZoomIn className="mr-2 h-4 w-4" />
                                View Full Size
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto bg-[#1E1E1E] border-[#444] text-white">
                              <DialogHeader>
                                <DialogTitle>Full Screenshot Preview</DialogTitle>
                              </DialogHeader>
                              <div className="mt-4 flex justify-center">
                                <img
                                  src={imagePreview}
                                  alt="Screenshot full view"
                                  className="w-full h-auto"
                                />
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <div className="flex justify-center items-center min-h-[200px]">
                          <img
                            src={imagePreview}
                            alt="Screenshot preview"
                            className="max-w-full h-auto max-h-96 rounded-none border border-[#444] object-contain"
                          />
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-gray-400">
                      Vision AI only: Analyze screenshots when DOM access isn&apos;t available (experimental).
                    </p>
                  </div>
                </TabsContent>
              </Tabs>

              {error && (
                <div className="mt-4 p-4 bg-red-500/10 text-red-500 rounded-none flex items-center gap-2 border border-red-500/20">
                  <AlertCircle className="h-4 w-4" />
                  <p>{error}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {results && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Analysis Results</h2>
                <div className="flex gap-2">
                  <Button onClick={handleEditInCustomizer} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                    <Palette className="mr-2 h-4 w-4" />
                    Edit in Customizer
                  </Button>
                  <Button variant="outline" onClick={downloadArtifacts} className="border-[#444] text-gray-300 hover:bg-[#333] hover:text-white rounded-md">
                    <Download className="mr-2 h-4 w-4" />
                    Download JSON
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="tokens" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-[#252525] rounded-none">
                  <TabsTrigger value="tokens" className="data-[state=active]:bg-[#333] data-[state=active]:text-white rounded-none">Tokens</TabsTrigger>
                  <TabsTrigger value="components" className="data-[state=active]:bg-[#333] data-[state=active]:text-white rounded-none">Components</TabsTrigger>
                  <TabsTrigger value="layouts" className="data-[state=active]:bg-[#333] data-[state=active]:text-white rounded-none">Layouts</TabsTrigger>
                  {results.metadata && <TabsTrigger value="metadata" className="data-[state=active]:bg-[#333] data-[state=active]:text-white rounded-none">Metadata</TabsTrigger>}
                  <TabsTrigger value="debug" className="data-[state=active]:bg-[#333] data-[state=active]:text-white rounded-none">Debug Log</TabsTrigger>
                </TabsList>

                <TabsContent value="tokens" className="mt-4">
                  <Card className="bg-[#1E1E1E] border-[#444] rounded-none">
                    <CardHeader>
                      <CardTitle className="text-white">Design Tokens</CardTitle>
                      <CardDescription className="text-gray-400">Normalized colors, typography, spacing, and radius.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-[#252525] p-4 rounded-none overflow-auto max-h-[600px] text-xs text-gray-300 border border-[#444]">
                        {JSON.stringify(results.tokens, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="components" className="mt-4">
                  <Card className="bg-[#1E1E1E] border-[#444] rounded-none">
                    <CardHeader>
                      <CardTitle className="text-white">Components</CardTitle>
                      <CardDescription className="text-gray-400">Detected UI patterns and signatures.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-[#252525] p-4 rounded-none overflow-auto max-h-[600px] text-xs text-gray-300 border border-[#444]">
                        {JSON.stringify(results.components, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="layouts" className="mt-4">
                  <Card className="bg-[#1E1E1E] border-[#444] rounded-none">
                    <CardHeader>
                      <CardTitle className="text-white">Layout Structure</CardTitle>
                      <CardDescription className="text-gray-400">High-level section sequence.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-[#252525] p-4 rounded-none overflow-auto max-h-[600px] text-xs text-gray-300 border border-[#444]">
                        {JSON.stringify(results.layouts, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>

                {results.metadata && (
                  <TabsContent value="metadata" className="mt-4">
                    <Card className="bg-[#1E1E1E] border-[#444] rounded-none">
                      <CardHeader>
                        <CardTitle className="text-white">Hybrid Scraper Metadata</CardTitle>
                        <CardDescription className="text-gray-400">Information about the scraping process and merge strategy.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <h3 className="text-sm font-semibold mb-2 text-gray-200">Scraping Configuration</h3>
                          <div className="bg-[#252525] p-4 rounded-none border border-[#444] space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Strategy:</span>
                              <span className="text-sm font-medium text-white">{results.metadata.strategy}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">DOM Scraping:</span>
                              <span className="text-sm font-medium text-white">{results.metadata.domScrapingEnabled ? "✓ Enabled" : "✗ Disabled"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Vision AI:</span>
                              <span className="text-sm font-medium text-white">{results.metadata.visionAIEnabled ? "✓ Enabled" : "✗ Disabled"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-400">Screenshot:</span>
                              <span className="text-sm font-medium text-white">{results.metadata.screenshotTaken ? "✓ Captured" : "✗ Not Captured"}</span>
                            </div>
                          </div>
                        </div>

                        {results.individual && (
                          <div>
                            <h3 className="text-sm font-semibold mb-2 text-gray-200">Individual Results</h3>
                            <div className="space-y-4">
                              {results.individual.dom && (
                                <Card className="bg-[#252525] border-[#444] rounded-none">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base text-white">DOM Scraper Results</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-sm space-y-1 text-gray-300">
                                      <div>Colors: {Object.keys(results.individual.dom.tokens.colors).length}</div>
                                      <div>Buttons: {results.individual.dom.components.buttons.length}</div>
                                      <div>Cards: {results.individual.dom.components.cards.length}</div>
                                      <div>Layout Sections: {results.individual.dom.layouts.sections.length}</div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}

                              {results.individual.vision && (
                                <Card className="bg-[#252525] border-[#444] rounded-none">
                                  <CardHeader className="pb-3">
                                    <CardTitle className="text-base text-white">Vision AI Results</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="text-sm space-y-1 text-gray-300">
                                      <div>Colors: {Object.keys(results.individual.vision.tokens.colors).length}</div>
                                      <div>Buttons: {results.individual.vision.components.buttons.length}</div>
                                      <div>Cards: {results.individual.vision.components.cards.length}</div>
                                      <div>Layout Sections: {results.individual.vision.layouts.sections.length}</div>
                                    </div>
                                  </CardContent>
                                </Card>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                )}

                <TabsContent value="debug" className="mt-4">
                  <Card className="bg-[#1E1E1E] border-[#444] rounded-none">
                    <CardHeader>
                      <CardTitle className="text-white">Debug Log</CardTitle>
                      <CardDescription className="text-gray-400">Decision trail and raw analysis data.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-[#252525] p-4 rounded-none overflow-auto max-h-[600px] text-xs text-gray-300 border border-[#444]">
                        {JSON.stringify(results.debug, null, 2)}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Name Theme Dialog */}
          <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
            <DialogContent className="sm:max-w-md bg-[#1E1E1E] border-[#444] text-white">
              <DialogHeader>
                <DialogTitle>Name Your Theme</DialogTitle>
                <CardDescription className="text-gray-400">
                  Give your imported theme a memorable name before opening it in the customizer.
                </CardDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="theme-name" className="text-gray-200">Theme Name</Label>
                  <Input
                    id="theme-name"
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && themeName.trim()) {
                        handleConfirmEdit();
                      }
                    }}
                    placeholder="e.g., Stripe Theme, My Custom Theme"
                    autoFocus
                    className="bg-[#252525] border-[#444] text-white rounded-none focus-visible:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowNameDialog(false)}
                    className="border-[#444] text-gray-300 hover:bg-[#333] hover:text-white rounded-md"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleConfirmEdit}
                    disabled={!themeName.trim()}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                  >
                    <Palette className="mr-2 h-4 w-4" />
                    Open in Customizer
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
