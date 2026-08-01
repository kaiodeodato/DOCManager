import { redirect } from "next/navigation";

/** Legacy path — Assistant (Giulia) lives at /assistant. */
export default function GiuliaAliasPage() {
  redirect("/assistant");
}
