"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Palette, Upload, X, Image as ImageIcon } from "lucide-react"

interface UploadedImage {
  id: string
  file: File
  preview: string
}

export default function InspirationPage() {
  const router = useRouter()
  const [uploadedImages, setUploadedImages] = React.useState<UploadedImage[]>([])
  const [isDragging, setIsDragging] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const newImages: UploadedImage[] = []
    const remainingSlots = 5 - uploadedImages.length

    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const id = Math.random().toString(36).substring(7)
        const preview = URL.createObjectURL(file)
        newImages.push({ id, file, preview })
      }
    })

    setUploadedImages((prev) => [...prev, ...newImages])
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const removeImage = (id: string) => {
    setUploadedImages((prev) => {
      const image = prev.find((img) => img.id === id)
      if (image) {
        URL.revokeObjectURL(image.preview)
      }
      return prev.filter((img) => img.id !== id)
    })
  }

  const handleContinue = () => {
    // Check if we came from the wizard
    const urlParams = new URLSearchParams(window.location.search)
    const fromWizard = urlParams.get("from") === "wizard"

    if (fromWizard) {
      router.push("/wizard/ux?from=inspiration")
    } else {
      router.push("/loading")
    }
  }

  React.useEffect(() => {
    return () => {
      // Cleanup preview URLs
      uploadedImages.forEach((img) => URL.revokeObjectURL(img.preview))
    }
  }, [])

  const canUploadMore = uploadedImages.length < 5

  return (
    <div className="min-h-screen bg-[#2C2C2C] text-white flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-6 border-b border-[#444] bg-[#2C2C2C] shrink-0">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <Palette className="h-5 w-5" />
          <span>DevDesignKit</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-[#3C3C3C]">
            Sign In
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-none">
            Sign Up
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6 py-8 max-w-4xl mx-auto w-full">
        <div className="space-y-6 flex-1">
          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Upload Inspiration</h1>
            <p className="text-gray-400">
              Upload 1-5 screenshots to extract your design system
            </p>
          </div>

          {/* Dropzone */}
          {canUploadMore && (
            <Card
              className={`bg-[#1E1E1E] border-2 border-dashed transition-all ${isDragging
                ? "border-blue-500 bg-[#252525]"
                : "border-[#444] hover:border-[#555]"
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                  <div className="w-16 h-16 rounded-lg bg-[#2C2C2C] border border-[#444] flex items-center justify-center">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Upload screenshots</p>
                    <p className="text-sm text-gray-400">
                      Drag and drop images here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      {uploadedImages.length} / 5 images uploaded
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-4 border-[#444] text-white hover:bg-[#3C3C3C]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview Thumbnails */}
          {uploadedImages.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Uploaded Images</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {uploadedImages.map((image) => (
                  <Card key={image.id} className="bg-[#1E1E1E] border-[#444] relative group">
                    <CardContent className="p-0 relative aspect-square">
                      <img
                        src={image.preview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4 text-white" />
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Continue Button - Fixed at bottom */}
        <div className="flex justify-end pt-6 border-t border-[#444] mt-8">
          <Button
            onClick={handleContinue}
            disabled={uploadedImages.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </Button>
        </div>
      </main>
    </div>
  )
}

