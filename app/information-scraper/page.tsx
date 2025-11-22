"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Download, AlertCircle, Upload, Link as LinkIcon, ZoomIn } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function InformationScraper() {
  const [inputMode, setInputMode] = useState<"url" | "image">("url");
  const [url, setUrl] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

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

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">DevUX Scraper</h1>
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
            <Tabs value={inputMode} onValueChange={(v) => setInputMode(v as "url" | "image")} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="url">
                  <LinkIcon className="mr-2 h-4 w-4" />
                  URL Scraper
                </TabsTrigger>
                <TabsTrigger value="image">
                  <Upload className="mr-2 h-4 w-4" />
                  Image Analyzer
                </TabsTrigger>
              </TabsList>
              
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
                  Enter a website URL to extract design system via DOM scraping (most accurate).
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
                    Upload a website screenshot to analyze design via AI vision model (experimental).
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
              <Button variant="outline" onClick={downloadArtifacts}>
                <Download className="mr-2 h-4 w-4" />
                Download JSON
              </Button>
            </div>

            <Tabs defaultValue="tokens" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="tokens">Tokens</TabsTrigger>
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="layouts">Layouts</TabsTrigger>
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
      </div>
    </div>
  );
}
