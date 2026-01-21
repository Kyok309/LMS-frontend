import { Loader2 } from "lucide-react";

function Loading() {
    return (
        <div className="w-full h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-gray-600">Уншиж байна...</p>
            </div>
        </div>
    );
}

export default Loading;