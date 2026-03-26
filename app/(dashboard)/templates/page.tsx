import { redirect } from "next/navigation";
export default function TemplatesRedirect() {
  redirect("/dashboard/forge?section=templates");
}
