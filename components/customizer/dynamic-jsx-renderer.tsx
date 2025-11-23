"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

// Component registry for dynamic rendering
const componentRegistry: Record<string, React.ComponentType<any>> = {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Input,
  Label,
  Badge,
  Separator,
  Avatar,
  AvatarImage,
  AvatarFallback,
  div: 'div' as any,
  span: 'span' as any,
  p: 'p' as any,
  h1: 'h1' as any,
  h2: 'h2' as any,
  h3: 'h3' as any,
  h4: 'h4' as any,
  section: 'section' as any,
  a: 'a' as any,
  img: 'img' as any,
  nav: 'nav' as any,
  ul: 'ul' as any,
  li: 'li' as any,
}

interface DynamicJSXRendererProps {
  code: string
  className?: string
}

export function DynamicJSXRenderer({ code, className }: DynamicJSXRendererProps) {
  const [error, setError] = React.useState<string | null>(null)
  const [renderedComponent, setRenderedComponent] = React.useState<React.ReactNode>(null)

  React.useEffect(() => {
    try {
      // Create a function that returns the JSX
      // We need to transform component names to use our registry
      const transformedCode = code.replace(
        /<(\w+)/g,
        (match, componentName) => {
          if (componentRegistry[componentName]) {
            return `<${componentName}`
          }
          return match
        }
      )

      // Use Function constructor to create a render function
      // This is safe because we control the input (it comes from our API)
      const renderFunction = new Function(
        ...Object.keys(componentRegistry),
        'React',
        `return (${transformedCode})`
      )

      // Call the function with our components
      const component = renderFunction(
        ...Object.values(componentRegistry),
        React
      )

      setRenderedComponent(component)
      setError(null)
    } catch (err: any) {
      console.error('Rendering error:', err)
      setError(err.message)
      
      // Fallback to dangerouslySetInnerHTML for simple HTML
      setRenderedComponent(
        <div dangerouslySetInnerHTML={{ __html: code }} />
      )
    }
  }, [code])

  if (error) {
    return (
      <div className={className}>
        <div className="p-4 border border-amber-400/50 rounded-lg bg-amber-950/20 text-amber-400 text-sm mb-4">
          <p className="font-semibold mb-1">Rendering as HTML (Component parsing failed)</p>
          <p className="text-xs opacity-75">{error}</p>
        </div>
        <div dangerouslySetInnerHTML={{ __html: code }} />
      </div>
    )
  }

  return (
    <div className={className}>
      {renderedComponent}
    </div>
  )
}

