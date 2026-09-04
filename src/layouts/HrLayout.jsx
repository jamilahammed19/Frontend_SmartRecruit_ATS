import { Outlet } from "react-router-dom";
import HrSidebar from "../components/layout/HrSidebar"; // <-- Updated to point to the layout folder

export default function HrLayout() {
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <HrSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <h2 className="text-xl font-semibold text-slate-800">
            Recruitment Portal
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
              HR & Management
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
