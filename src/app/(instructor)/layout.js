import InstructorHeader from "./components/header";
import Sidebar from "./components/sidebar";

export default function InstructorLayout({ children }) {
  return (
    <div className="w-full max-h-screen h-screen flex">
        <Sidebar/>
        <div className="w-full bg-gray-50 flex flex-col overflow-y-auto">
          <InstructorHeader/>
          <div className="w-full p-6 md:p-8">
            {children}
          </div>
        </div>
    </div>
  );
}