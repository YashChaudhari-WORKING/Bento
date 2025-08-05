// components/LoadingSpinner.tsx
export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}
