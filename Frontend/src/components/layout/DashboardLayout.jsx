import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({
  children,
  title = "Dashboard",
  description = "",
}) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        
        {/* Navbar */}
        <Navbar
          title={title}
          description={description}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="mx-auto w-full max-w-[1440px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;