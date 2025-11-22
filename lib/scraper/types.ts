export interface ScrapeResult {
  tokens: Tokens;
  components: Components;
  layouts: Layouts;
  debug: DebugLog;
}

export interface Tokens {
  colors: {
    background: string;
    foreground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
  };
  fonts: {
    sans: string;
    serif: string;
    mono: string;
    sizes: {
      body: string;
      heading: string[];
      caption: string;
    };
  };
  radius: {
    small: string;
    medium: string;
    large: string;
  };
  spacing: {
    base: string;
  };
  shadows: {
    base: string;
    large: string;
  };
}

export interface Components {
  buttons: ComponentStyle[];
  cards: ComponentStyle[];
  navItems: ComponentStyle[];
  forms?: ComponentStyle[];
  feedback?: ComponentStyle[];
  dataDisplay?: ComponentStyle[];
}

export interface ComponentStyle {
  // Core identification
  component?: string;
  shadcnVariant?: string;
  shadcnStructure?: string;
  
  // Visual properties
  background: string;
  color: string;
  border?: string;
  padding: string;
  radius: string;
  shadow: string;
  
  // Typography
  fontSize?: string;
  fontWeight?: string;
  
  // Layout
  hasHeader?: boolean;
  hasFooter?: boolean;
  contentLayout?: string;
  
  // Icons
  usesIcons?: boolean;
  iconStyle?: string;
  hasIcon?: boolean;
  iconPosition?: string;
  
  // Metadata
  description?: string;
  frequency: number;
  
  // Fallback for any additional properties
  [key: string]: any;
}

export interface Layouts {
  sections: LayoutSection[];
}

export interface LayoutSection {
  type: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  metadata?: {
    confidence?: "high" | "medium" | "low";
    framework?: "shadcn/ui" | "generic";
    isSticky?: boolean;
    cardCount?: number;
    layoutType?: "grid" | "flex" | "block";
    dataAttributes?: Record<string, string>;
  };
}

export interface DebugLog {
  url: string;
  timestamp: string;
  logs: string[];
  errors: string[];
}

export interface StyledNode {
  tag: string;
  classes: string[];
  role: string | null;
  textLength: number;
  dataAttributes: Record<string, string>;
  styles: {
    backgroundColor: string;
    color: string;
    fontFamily: string;
    fontSize: string;
    fontWeight: string;
    borderRadius: string;
    padding: string;
    margin: string;
    boxShadow: string;
    display: string;
    position: string;
    zIndex: string;
    flexDirection: string;
    gridTemplateColumns: string;
    width: string;
  };
  rect: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

