import { FileText } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = "Nothing to see here...yet!",
  description = "Coming Soon",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center shadow-sm">
          <div className="relative">
            <FileText size={40} className="text-blue-600" />
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-xl font-bold text-gray-800">{title}</p>
          <p className="text-gray-400 text-sm mt-1">{description}</p>
        </div>
      </div>
    </div>
  );
}