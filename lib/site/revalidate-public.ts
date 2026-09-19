import { revalidatePath } from "next/cache";

/** Call after admin saves content so marketing pages show fresh MongoDB data. */
export function revalidatePublicSite() {
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/hunts");
  revalidatePath("/pricing");
  revalidatePath("/shop");
  revalidatePath("/faq");
  revalidatePath("/contact");
  revalidatePath("/how-it-works");
  revalidatePath("/safety");
  revalidatePath("/terms");
  revalidatePath("/privacy");
  revalidatePath("/refund-policy");
  revalidatePath("/booking");
}
