export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/60 z-50">
      <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
    </div>
  );
}
