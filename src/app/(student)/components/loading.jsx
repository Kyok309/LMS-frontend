import { Spinner } from "@/components/ui/spinner";

function Loading() {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <Spinner className="w-10 h-10"/>
        </div>
    );
}

export default Loading;