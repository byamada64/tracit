import "./globals.css";
import Sidebar from "../components/layout/Sidebar";
import Banner from "../components/layout/Banner";
import PageContainer from "../components/layout/PageContainer";
import "../components/layout/Layout.css";

export const metadata = {
  title: "TracIT Cloud",
  description: "Automation-powered job search intelligence platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="layout-root">
        <Sidebar />
        <div className="layout-main">
          <Banner />
          <PageContainer>{children}</PageContainer>
        </div>
      </body>
    </html>
  );
}
