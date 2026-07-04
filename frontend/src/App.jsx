import { Route, Routes } from "react-router-dom";
import { TopNav } from "./components/TopNav.jsx";
import { Footer } from "./components/Footer.jsx";
import { ScrollToTop } from "./components/ScrollToTop.jsx";
import { HomePage } from "./pages/HomePage.jsx";
import { BaristasPage } from "./pages/BaristasPage.jsx";
import { BaristaDetailPage } from "./pages/BaristaDetailPage.jsx";
import { CreateBaristaPostPage } from "./pages/CreateBaristaPostPage.jsx";
import { CafeteriasPage } from "./pages/CafeteriasPage.jsx";
import { CafeteriaDetailPage } from "./pages/CafeteriaDetailPage.jsx";
import { FavoritosPage } from "./pages/FavoritosPage.jsx";
import { SeguidosPage } from "./pages/SeguidosPage.jsx";
import { RoadmapPage } from "./pages/RoadmapPage.jsx";
import { PedidoPage } from "./pages/PedidoPage.jsx";
import { RunnerLoginPage } from "./pages/RunnerLoginPage.jsx";
import { RunnerPage } from "./pages/RunnerPage.jsx";
import { AdminQrPage } from "./pages/AdminQrPage.jsx";
import { AboutPage } from "./pages/AboutPage.jsx";
import { PrivacyPage } from "./pages/PrivacyPage.jsx";
import { TermsPage } from "./pages/TermsPage.jsx";
import { ContactPage } from "./pages/ContactPage.jsx";
import { FaqPage } from "./pages/FaqPage.jsx";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <TopNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cafeterias" element={<CafeteriasPage />} />
        <Route path="/cafeterias/:id" element={<CafeteriaDetailPage />} />
        <Route path="/baristas" element={<BaristasPage />} />
        <Route path="/baristas/nueva" element={<CreateBaristaPostPage />} />
        <Route path="/baristas/:id/editar" element={<CreateBaristaPostPage />} />
        <Route path="/baristas/:id" element={<BaristaDetailPage />} />
        <Route path="/favoritos" element={<FavoritosPage />} />
        <Route path="/seguidos" element={<SeguidosPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/pedido" element={<PedidoPage />} />
        <Route path="/pedido/:mesaId" element={<PedidoPage />} />
        <Route path="/runner/login" element={<RunnerLoginPage />} />
        <Route path="/runner" element={<RunnerPage />} />
        <Route
          path="/admin/login"
          element={
            <RunnerLoginPage tokenKey="cupster_admin_token" redirectTo="/admin/qr" title="Admin login" />
          }
        />
        <Route path="/admin/qr" element={<AdminQrPage />} />
        <Route path="/sobre-cupster" element={<AboutPage />} />
        <Route path="/privacidad" element={<PrivacyPage />} />
        <Route path="/terminos" element={<TermsPage />} />
        <Route path="/contacto" element={<ContactPage />} />
        <Route path="/faq" element={<FaqPage />} />
      </Routes>
      <Footer />
    </>
  );
}
