"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ScrapedComponent } from "@/lib/hooks/use-scraped-data"
import { useTheme } from "@/lib/contexts/theme-context"
import { Sparkles, Loader2 } from "lucide-react"

interface ScrapedComponentRendererProps {
  component: ScrapedComponent
  index: number
}

export function ScrapedComponentRenderer({ component, index }: ScrapedComponentRendererProps) {
  const { theme } = useTheme()
  const [aiGenerated, setAiGenerated] = React.useState<string | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const generateAIComponent = async () => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch("/api/generate-component", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          component,
          theme,
          componentType: component.type,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to generate component")
      }
      
      const data = await response.json()
      setAiGenerated(data.code)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }
  
  if (component.type === "button") {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Button {index + 1}</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateAIComponent}
            disabled={isGenerating}
            className="h-7 text-xs gap-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3" />
                AI Enhance
              </>
            )}
          </Button>
        </div>
        
        {aiGenerated ? (
          <div className="p-4 border rounded-lg bg-background">
            <div className="flex items-center justify-center">
              <div dangerouslySetInnerHTML={{ __html: aiGenerated }} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI-Generated with shadcn/ui
            </div>
          </div>
        ) : (
          <Button
            style={{
              backgroundColor: component.background,
              color: component.color,
              border: component.border,
              padding: component.padding,
              borderRadius: component.radius,
              boxShadow: component.shadow,
              fontSize: component.fontSize,
              fontWeight: component.fontWeight,
            }}
          >
            {component.text || `Button ${index + 1}`}
          </Button>
        )}
        
        {error && <p className="text-xs text-red-400">{error}</p>}
        {component.shadcnVariant && (
          <p className="text-xs text-muted-foreground">
            Detected variant: {component.shadcnVariant}
          </p>
        )}
      </div>
    )
  }

  if (component.type === "card") {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Card {index + 1}</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateAIComponent}
            disabled={isGenerating}
            className="h-7 text-xs gap-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3" />
                AI Enhance
              </>
            )}
          </Button>
        </div>
        
        {aiGenerated ? (
          <div className="space-y-2">
            <div 
              className="border rounded-lg overflow-hidden"
              dangerouslySetInnerHTML={{ __html: aiGenerated }}
            />
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI-Generated with shadcn/ui styling
            </div>
          </div>
        ) : (
          <Card
            style={{
              backgroundColor: component.background,
              color: component.color,
              border: component.border,
              borderRadius: component.radius,
              boxShadow: component.shadow,
            }}
          >
            <CardHeader>
              <CardTitle style={{ fontSize: component.fontSize, fontWeight: component.fontWeight }}>
                {component.text || `Card ${index + 1}`}
              </CardTitle>
              <CardDescription>
                Scraped from inspiration website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p style={{ padding: component.padding }}>
                This card was detected from your inspiration website.
              </p>
            </CardContent>
          </Card>
        )}
        
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  if (component.type === "navItem") {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Nav Item {index + 1}</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={generateAIComponent}
            disabled={isGenerating}
            className="h-7 text-xs gap-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3" />
                AI Enhance
              </>
            )}
          </Button>
        </div>
        
        {aiGenerated ? (
          <div className="space-y-2">
            <div 
              className="inline-block"
              dangerouslySetInnerHTML={{ __html: aiGenerated }}
            />
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              AI-Generated with shadcn/ui styling
            </div>
          </div>
        ) : (
          <a
            href="#"
            style={{
              backgroundColor: component.background,
              color: component.color,
              border: component.border,
              padding: component.padding,
              borderRadius: component.radius,
              fontSize: component.fontSize,
              fontWeight: component.fontWeight,
              display: "inline-block",
            }}
          >
            {component.text || `Navigation ${index + 1}`}
          </a>
        )}
        
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  return null
}

export interface ScrapedLayoutRendererProps {
  layoutType: string
  confidence?: "high" | "medium" | "low"
  framework?: "shadcn/ui" | "generic"
  layoutSection: any
}

export function ScrapedLayoutRenderer({ layoutType, confidence, framework, layoutSection }: ScrapedLayoutRendererProps) {
  const { theme } = useTheme()
  const [aiGenerated, setAiGenerated] = React.useState<string | null>(null)
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  
  const generateAILayout = async () => {
    setIsGenerating(true)
    setError(null)
    
    try {
      const response = await fetch("/api/generate-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layoutSection,
          theme,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to generate layout")
      }
      
      const data = await response.json()
      setAiGenerated(data.code)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsGenerating(false)
    }
  }
  
  return (
    <div className="space-y-6">
      <div className="border-b pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">{layoutType} Layout</h2>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Confidence: <span className={confidence === "high" ? "text-green-400" : "text-yellow-400"}>{confidence || "medium"}</span></span>
            {framework && <span>Framework: {framework}</span>}
          </div>
        </div>
        
        <Button
          onClick={generateAILayout}
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating with AI...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Layout with AI
            </>
          )}
        </Button>
      </div>
      
      <div className="space-y-4">
        {aiGenerated ? (
          <div className="border rounded-lg overflow-hidden bg-background">
            <div 
              className="p-6"
              dangerouslySetInnerHTML={{ __html: aiGenerated }}
            />
          </div>
        ) : (
          <div className="p-8 border rounded-lg bg-muted/50">
            <p className="text-center text-muted-foreground">
              {layoutType} layout section detected from your inspiration website.
            </p>
            <p className="text-center text-sm text-muted-foreground mt-2">
              Click "Generate Layout with AI" above to create a production-ready {layoutType} section.
            </p>
            <p className="text-center text-xs text-muted-foreground mt-4">
              AI will generate beautiful, responsive JSX using your theme tokens!
            </p>
          </div>
        )}
        
        {error && (
          <div className="p-4 border border-red-400/50 rounded-lg bg-red-950/20 text-red-400 text-sm">
            Error: {error}
          </div>
        )}
      </div>
    </div>
  )
}

