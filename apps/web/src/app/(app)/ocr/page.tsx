import { redirect } from "next/navigation";

export default function OcrIndexPage() {
  redirect("/ocr/queue");
}
