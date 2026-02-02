import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import DashBoard from "./pages/DashBoard";
import ViewExpenses from "./pages/ViewExpenses";

export default function App() {
  return (
    <BrowserRouter>
      <SidebarProvider>
        <AppSidebar />
        <Routes>
          <Route path="/" element={<DashBoard />} />
          <Route path="/view-expenses" element={<ViewExpenses />} />
        </Routes>
        <Toaster position="top-right" />
      </SidebarProvider>
    </BrowserRouter>
  )
}
