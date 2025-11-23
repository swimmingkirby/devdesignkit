"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

type ProductState = {
    type: string
    audience: string
    personality: string
}

type ThemeState = {
    aesthetic: string
    themeId: string
}

type UxState = {
    smoothTransitions: boolean
    buttonMicroAnimations: boolean
    cardHoverLift: boolean
    focusGlow: boolean
    activeTabMotion: boolean
    scrollBoundaryFades: boolean
    depthShadows: boolean
    headingHierarchy: boolean
    relaxedLineHeight: boolean
    sectionSpacingRhythm: boolean
}

type WizardState = {
    product: ProductState
    theme: ThemeState
    ux: UxState
    setProduct: (product: Partial<ProductState>) => void
    setTheme: (theme: Partial<ThemeState>) => void
    setUx: (ux: Partial<UxState>) => void
}

const defaultState: WizardState = {
    product: { type: "", audience: "", personality: "" },
    theme: { aesthetic: "", themeId: "" },
    ux: {
        smoothTransitions: false,
        buttonMicroAnimations: false,
        cardHoverLift: false,
        focusGlow: false,
        activeTabMotion: false,
        scrollBoundaryFades: false,
        depthShadows: false,
        headingHierarchy: false,
        relaxedLineHeight: false,
        sectionSpacingRhythm: false
    },
    setProduct: () => { },
    setTheme: () => { },
    setUx: () => { },
}

const WizardContext = createContext<WizardState>(defaultState)

export const WizardProvider = ({ children }: { children: ReactNode }) => {
    const [product, setProductState] = useState<ProductState>(defaultState.product)
    const [theme, setThemeState] = useState<ThemeState>(defaultState.theme)
    const [ux, setUxState] = useState<UxState>(defaultState.ux)
    const [isLoaded, setIsLoaded] = useState(false)

    // Load from localStorage on mount
    React.useEffect(() => {
        const saved = localStorage.getItem("wizard-state")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (parsed.product) setProductState(parsed.product)
                if (parsed.theme) setThemeState(parsed.theme)
                if (parsed.ux) setUxState(parsed.ux)
            } catch (e) {
                console.error("Failed to parse wizard state", e)
            }
        }
        setIsLoaded(true)
    }, [])

    // Save to localStorage on change
    React.useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("wizard-state", JSON.stringify({ product, theme, ux }))
        }
    }, [product, theme, ux, isLoaded])

    const setProduct = (updates: Partial<ProductState>) => {
        setProductState((prev) => ({ ...prev, ...updates }))
    }

    const setTheme = (updates: Partial<ThemeState>) => {
        setThemeState((prev) => ({ ...prev, ...updates }))
    }

    const setUx = (updates: Partial<UxState>) => {
        setUxState((prev) => ({ ...prev, ...updates }))
    }

    return (
        <WizardContext.Provider value={{ product, theme, ux, setProduct, setTheme, setUx }}>
            {children}
        </WizardContext.Provider>
    )
}

export const useWizard = () => useContext(WizardContext)
