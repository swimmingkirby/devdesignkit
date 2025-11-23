import { Theme } from "./theme-types"
import {
    minimalThemes,
    roundedThemes,
    playfulThemes,
    brutalistThemes,
    techThemes,
    warmThemes,
    darkThemes,
} from "./preset-themes"

export const themesByAesthetic: Record<string, Theme[]> = {
    minimal: minimalThemes,
    rounded: roundedThemes,
    playful: playfulThemes,
    brutalist: brutalistThemes,
    tech: techThemes,
    warm: warmThemes,
    dark: darkThemes,
}
