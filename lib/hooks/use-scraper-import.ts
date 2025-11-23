import { useState, useCallback } from "react";
import { ThemeTokens } from "@/lib/types/theme";
import { convertScraperToTheme, generateThemeName, validateScraperOutput } from "@/lib/utils/scraper-converter";

export interface ScraperImportState {
  loading: boolean;
  error: string | null;
  theme: ThemeTokens | null;
  themeName: string | null;
}

export function useScraperImport() {
  const [state, setState] = useState<ScraperImportState>({
    loading: false,
    error: null,
    theme: null,
    themeName: null,
  });

  const importFromUrl = useCallback(async (url: string): Promise<ThemeTokens | null> => {
    setState({ loading: true, error: null, theme: null, themeName: null });

    try {
      // Validate URL format
      try {
        new URL(url);
      } catch {
        throw new Error("Invalid URL format");
      }

      // Call hybrid scraper API
      const response = await fetch("/api/hybrid-scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url,
          options: {
            enableDOMScraping: true,
            enableVisionAI: true,
            mergeStrategy: "best-of-both",
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Failed to scrape URL" }));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to scrape URL`);
      }

      const scraperOutput = await response.json();

      // Validate scraper output
      if (!validateScraperOutput(scraperOutput)) {
        throw new Error("Invalid scraper output format");
      }

      // Convert to theme format
      const theme = convertScraperToTheme(scraperOutput);
      const themeName = generateThemeName(url);

      setState({
        loading: false,
        error: null,
        theme,
        themeName,
      });

      return theme;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to import theme from URL";
      setState({
        loading: false,
        error: errorMessage,
        theme: null,
        themeName: null,
      });
      return null;
    }
  }, []);

  const importFromData = useCallback(async (scraperOutput: any): Promise<ThemeTokens | null> => {
    setState({ loading: true, error: null, theme: null, themeName: null });

    try {
      // Validate scraper output
      if (!validateScraperOutput(scraperOutput)) {
        throw new Error("Invalid scraper output format");
      }

      // Convert to theme format
      const theme = convertScraperToTheme(scraperOutput);
      const themeName = scraperOutput.debug?.url 
        ? generateThemeName(scraperOutput.debug.url)
        : "Imported Theme";

      setState({
        loading: false,
        error: null,
        theme,
        themeName,
      });

      return theme;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to import theme from data";
      setState({
        loading: false,
        error: errorMessage,
        theme: null,
        themeName: null,
      });
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ loading: false, error: null, theme: null, themeName: null });
  }, []);

  return {
    ...state,
    importFromUrl,
    importFromData,
    reset,
  };
}

