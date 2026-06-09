import * as React from "react"

export function useFontsLoaded() {
  const subscribe = React.useCallback((callback: () => void) => {
    const notify = () => callback()

    document.fonts.addEventListener("loadingdone", notify)

    if (document.fonts.status !== "loaded") {
      void document.fonts.ready.then(notify)
    }

    return () => document.fonts.removeEventListener("loadingdone", notify)
  }, [])

  const getSnapshot = React.useCallback(
    () => document.fonts.status === "loaded",
    []
  )

  const getServerSnapshot = React.useCallback(() => false, [])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
