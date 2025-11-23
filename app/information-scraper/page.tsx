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
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {isFromWizard && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/wizard/source")}
            className="gap-2 -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Wizard
          </Button>
        )}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            {isFromWizard ? "Import from Inspiration Website" : "DevUX Scraper"}
          </h1>
          <p className="text-muted-foreground text-lg">
            Extract design tokens, components, and layouts from any website.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analyze Website Design</CardTitle>
            <CardDescription>
              Extract design tokens, components, and layouts from a URL or screenshot.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "url" | "image" | "hybrid")} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="hybrid">
                  <Combine className="mr-2 h-4 w-4" />
                  Hybrid (Best)
                </TabsTrigger>
                <TabsTrigger value="url">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  DOM Only
                </TabsTrigger>
                <TabsTrigger value="image">
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
                    className="flex-1"
                  />
                  <Button onClick={handleHybridScrape} disabled={loading || !url}>
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
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                    <Combine className="h-4 w-4" />
                    Hybrid Approach (Recommended)
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Combines DOM scraping with AI vision for the most comprehensive analysis:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
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
                    className="flex-1"
                  />
                  <Button onClick={handleScrape} disabled={loading || !url}>
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
                <p className="text-sm text-muted-foreground">
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
                        className="cursor-pointer"
                      />
                    </div>
                    <Button 
                      onClick={handleAnalyzeImage} 
                      disabled={loading || !imageFile}
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
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium">Preview:</p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ZoomIn className="mr-2 h-4 w-4" />
                              View Full Size
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-auto">
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
                          className="max-w-full h-auto max-h-96 rounded-md border object-contain"
                        />
                      </div>
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground">
                    Vision AI only: Analyze screenshots when DOM access isn&apos;t available (experimental).
                  </p>
                </div>
              </TabsContent>
            </Tabs>
            
            {error && (
              <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md flex items-center gap-2">
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
                <Button onClick={handleEditInCustomizer}>
                  <Palette className="mr-2 h-4 w-4" />
                  Edit in Customizer
                </Button>
                <Button variant="outline" onClick={downloadArtifacts}>
                  <Download className="mr-2 h-4 w-4" />
                  Download JSON
                </Button>
              </div>
            </div>

            <Tabs defaultValue="tokens" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="layouts">Layouts</TabsTrigger>
                {results.metadata && <TabsTrigger value="metadata">Metadata</TabsTrigger>}
                <TabsTrigger value="debug">Debug Log</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tokens" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Design Tokens</CardTitle>
                    <CardDescription>Normalized colors, typography, spacing, and radius.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px] text-xs">
                      {JSON.stringify(results.tokens, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="components" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Components</CardTitle>
                    <CardDescription>Detected UI patterns and signatures.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px] text-xs">
                      {JSON.stringify(results.components, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="layouts" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Layout Structure</CardTitle>
                    <CardDescription>High-level section sequence.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px] text-xs">
                      {JSON.stringify(results.layouts, null, 2)}
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>

              {results.metadata && (
                <TabsContent value="metadata" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Hybrid Scraper Metadata</CardTitle>
                      <CardDescription>Information about the scraping process and merge strategy.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-sm font-semibold mb-2">Scraping Configuration</h3>
                        <div className="bg-muted p-4 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Strategy:</span>
                            <span className="text-sm font-medium">{results.metadata.strategy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">DOM Scraping:</span>
                            <span className="text-sm font-medium">{results.metadata.domScrapingEnabled ? "✓ Enabled" : "✗ Disabled"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Vision AI:</span>
                            <span className="text-sm font-medium">{results.metadata.visionAIEnabled ? "✓ Enabled" : "✗ Disabled"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Screenshot:</span>
                            <span className="text-sm font-medium">{results.metadata.screenshotTaken ? "✓ Captured" : "✗ Not Captured"}</span>
                          </div>
                        </div>
                      </div>
                      
                      {results.individual && (
                        <div>
                          <h3 className="text-sm font-semibold mb-2">Individual Results</h3>
                          <div className="space-y-4">
                            {results.individual.dom && (
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">DOM Scraper Results</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-sm space-y-1">
                                    <div>Colors: {Object.keys(results.individual.dom.tokens.colors).length}</div>
                                    <div>Buttons: {results.individual.dom.components.buttons.length}</div>
                                    <div>Cards: {results.individual.dom.components.cards.length}</div>
                                    <div>Layout Sections: {results.individual.dom.layouts.sections.length}</div>
                                  </div>
                                </CardContent>
                              </Card>
                            )}
                            
                            {results.individual.vision && (
                              <Card>
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base">Vision AI Results</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="text-sm space-y-1">
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
                <Card>
                  <CardHeader>
                    <CardTitle>Debug Log</CardTitle>
                    <CardDescription>Decision trail and raw analysis data.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[600px] text-xs">
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
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Name Your Theme</DialogTitle>
              <CardDescription>
                Give your imported theme a memorable name before opening it in the customizer.
              </CardDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="theme-name">Theme Name</Label>
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
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowNameDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmEdit}
                  disabled={!themeName.trim()}
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
  );
}
