import { useState, useEffect } from "react"

export interface ScrapedComponent {
  type: "button" | "card" | "navItem"
  text?: string
  background?: string
  color?: string
  border?: string
  padding?: string
  radius?: string
  shadow?: string
  fontSize?: string
  fontWeight?: string
  shadcnVariant?: string
}

export interface ScrapedLayout {
  type: string
  confidence?: "high" | "medium" | "low"
  framework?: "shadcn/ui" | "generic"
  metadata?: Record<string, any>
}

export interface ScrapedData {
  components: {
    buttons: ScrapedComponent[]
    cards: ScrapedComponent[]
    navItems: ScrapedComponent[]
  }
  layouts: {
    sections: ScrapedLayout[]
  }
  tokens?: any
}

export function useScrapedData() {
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null)
  const [hasScrapedData, setHasScrapedData] = useState(false)

  useEffect(() => {
    const storedData = sessionStorage.getItem("scrapedData")
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData)
        setScrapedData(parsed)
        setHasScrapedData(true)
        console.log("📦 Loaded scraped data:", parsed)
      } catch (error) {
        console.error("Failed to parse scraped data:", error)
        setScrapedData(null)
        setHasScrapedData(false)
      }
    } else {
      setScrapedData(null)
      setHasScrapedData(false)
    }
  }, [])

  const clearScrapedData = () => {
    sessionStorage.removeItem("scrapedData")
    setScrapedData(null)
    setHasScrapedData(false)
  }

  return {
    scrapedData,
    hasScrapedData,
    clearScrapedData,
  }
}

