import Header from "@/app/(student)/components/header";

export default function StudentLayout({ children }) {
  return (
    <>
        <Header/>
        <div className="w-full px-0 sm:px-10 lg:px-20">
          {children}
        </div>
    </>
  );
}