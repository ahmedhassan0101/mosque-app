"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
/**
 * ThemeProvider wraps the app with next-themes for seamless
 * Light / Dark / System theme switching.
 *
 * @param children - React node tree
 * @param props    - next-themes ThemeProviderProps
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
