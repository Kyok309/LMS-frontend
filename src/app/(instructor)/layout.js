import Sidebar from "./components/sidebar";

export default function InstructorLayout({ children }) {
  return (
    <div className="w-full max-h-screen h-screen flex">
        <Sidebar/>
        <div className="w-full max-h-screen h-screen p-6 md:p-8 overflow-y-scroll">
          {children}
        </div>
    </div>
  );
}