export default function LoadingSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950">
      <div className="text-center">
        <div className="relative mx-auto h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-neutral-800"></div>
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-red-600"></div>
        </div>
        <p className="mt-4 text-sm text-neutral-400">جاري التحميل...</p>
      </div>
    </div>
  )
}
