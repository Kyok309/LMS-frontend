import Header from "@/components/header";

export default function StudentLayout({ children }) {
  return (
    <div className="w-full h-full flex flex-col">
        <Header/>
        <div className="w-full flex-1 px-0 sm:px-10 lg:px-20">
          {children}
        </div>
    </div>
  );
}