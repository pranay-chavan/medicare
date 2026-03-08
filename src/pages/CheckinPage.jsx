import CheckinForm from "../components/checkin/CheckinForm";
import { useTheme } from "../context/ThemeContext";

export default function CheckinPage() {
  const { theme } = useTheme();
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      minHeight: "calc(100vh - 61px)",
      background: theme.bg,
    }}>
      <CheckinForm />
    </div>
  );
}