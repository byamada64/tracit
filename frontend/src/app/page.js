export default function Home() {
  // Redirect to /dashboard
  if (typeof window !== "undefined") {
    window.location.href = "/dashboard";
  }

  return null;
}
