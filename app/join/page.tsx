import { redirect } from "next/navigation";

export default function JoinPage() {
  redirect("/play?teammate=1");
}
