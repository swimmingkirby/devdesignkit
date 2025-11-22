"use client"

import { useWizard } from "../wizard-context"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import { Sparkles, MousePointer2, Eye } from "lucide-react"

export default function UxPage() {
    const { ux, setUx } = useWizard()
    const router = useRouter()
    const searchParams = useSearchParams()
    const fromInspiration = searchParams.get("from") === "inspiration"

    const themeParam = searchParams.get("theme")

    const handleContinue = () => {
        if (fromInspiration) {
            router.push("/loading")
        } else {
            const url = themeParam ? `/customizer?theme=${themeParam}` : "/customizer"
            router.push(url)
        }
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Refine the Experience</h1>
                <p className="text-muted-foreground text-lg">
                    Add premium polish and interaction details to your product.
                </p>
            </div>

            <div className="grid gap-6">
                {/* Microinteractions */}
                <Card className="p-6 rounded-xl">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <MousePointer2 className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">Microinteractions</h3>
                                <p className="text-sm text-muted-foreground">Subtle animations that improve feel.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="micro-1" className="flex-1 cursor-pointer">Smooth transitions on dialogs and sheets</Label>
                                    <Switch
                                        id="micro-1"
                                        checked={ux.smoothTransitions}
                                        onCheckedChange={(c) => setUx({ smoothTransitions: c })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="micro-2" className="flex-1 cursor-pointer">Button press micro-animation</Label>
                                    <Switch
                                        id="micro-2"
                                        checked={ux.buttonMicroAnimations}
                                        onCheckedChange={(c) => setUx({ buttonMicroAnimations: c })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="micro-3" className="flex-1 cursor-pointer">Card hover lift</Label>
                                    <Switch
                                        id="micro-3"
                                        checked={ux.cardHoverLift}
                                        onCheckedChange={(c) => setUx({ cardHoverLift: c })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Interaction Cues */}
                <Card className="p-6 rounded-xl">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Eye className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">Interaction Cues</h3>
                                <p className="text-sm text-muted-foreground">Visual feedback for user actions.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="cue-1" className="flex-1 cursor-pointer">Focus glow for keyboard users</Label>
                                    <Switch
                                        id="cue-1"
                                        checked={ux.focusGlow}
                                        onCheckedChange={(c) => setUx({ focusGlow: c })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="cue-2" className="flex-1 cursor-pointer">Animated active-tab indicator</Label>
                                    <Switch
                                        id="cue-2"
                                        checked={ux.activeTabMotion}
                                        onCheckedChange={(c) => setUx({ activeTabMotion: c })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="cue-3" className="flex-1 cursor-pointer">Scroll boundary fades</Label>
                                    <Switch
                                        id="cue-3"
                                        checked={ux.scrollBoundaryFades}
                                        onCheckedChange={(c) => setUx({ scrollBoundaryFades: c })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Visual Quality */}
                <Card className="p-6 rounded-xl">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <Sparkles className="h-6 w-6" />
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">Visual Quality</h3>
                                <p className="text-sm text-muted-foreground">Refinements for a premium look.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="vis-1" className="flex-1 cursor-pointer">Layered depth shadows</Label>
                                    <Switch
                                        id="vis-1"
                                        checked={ux.depthShadows}
                                        onCheckedChange={(c) => setUx({ depthShadows: c })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="vis-2" className="flex-1 cursor-pointer">Clean heading hierarchy</Label>
                                    <Switch
                                        id="vis-2"
                                        checked={ux.headingHierarchy}
                                        onCheckedChange={(c) => setUx({ headingHierarchy: c })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="vis-3" className="flex-1 cursor-pointer">Relaxed reading line-height</Label>
                                    <Switch
                                        id="vis-3"
                                        checked={ux.relaxedLineHeight}
                                        onCheckedChange={(c) => setUx({ relaxedLineHeight: c })}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="vis-4" className="flex-1 cursor-pointer">Consistent section spacing rhythm</Label>
                                    <Switch
                                        id="vis-4"
                                        checked={ux.sectionSpacingRhythm}
                                        onCheckedChange={(c) => setUx({ sectionSpacingRhythm: c })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex justify-between pt-6 items-center">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/wizard/theme")}
                >
                    Back
                </Button>
                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        onClick={handleContinue}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        Skip
                    </Button>
                    <Button
                        size="lg"
                        onClick={handleContinue}
                        className="w-full md:w-auto min-w-[200px]"
                    >
                        {fromInspiration ? "Generate Theme" : "Enter Customizer"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
