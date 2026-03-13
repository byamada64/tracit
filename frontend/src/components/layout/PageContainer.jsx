import { layoutTheme } from "@/config/theme";
import "./PageContainer.css";

export default function PageContainer({ children }) {
  return (
    <div
      className="page-container"
      style={{
        "--page-margin": `${layoutTheme.spacing.pageMargin}px`,
      }}
    >
      {children}
    </div>
  );
}
