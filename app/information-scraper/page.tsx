"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Download, AlertCircle } from "lucide-react";

export default function InformationScraper() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

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
            <CardTitle>Scrape URL</CardTitle>
            <CardDescription>
              Enter a URL to analyze its UI and generate design artifacts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input 
                placeholder="https://example.com" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)}
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
                  "Analyze UI"
                )}
              </Button>
            </div>
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
