export function DeviceGlow() {
  return (
    <>
      <div
        className="pointer-events-none absolute top-[42%] left-1/2 -z-10 h-[55%] w-[95%] -translate-x-1/2 -translate-y-1/2 animate-[pulse_5s_ease-in-out_infinite] rounded-[50%] bg-primary/35 blur-3xl max-sm:hidden"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-[45%] left-1/2 -z-10 h-[85%] w-[140%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-primary/15 blur-[100px] max-sm:hidden"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-[48%] left-1/2 -z-10 h-full w-[160%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_65%)] opacity-20 max-sm:hidden"
        aria-hidden="true"
      />
    </>
  )
}
