import { issueTestPassesForAllHunts } from "@/lib/testing/testHuntPasses";

async function main() {
  const passes = await issueTestPassesForAllHunts();
  console.log("\nMusic City Scavenger Hunt — QA passes (one code per hunt)\n");
  console.log("Captain email (optional login): qa-captain@musiccityscavengerhunt.test\n");
  for (const p of passes) {
    console.log(`— ${p.huntTitle} (${p.huntSlug})`);
    console.log(`  Join code:  ${p.joinCode}`);
    console.log(`  Lobby:      ${p.lobbyUrl}`);
    console.log(`  Reference:  ${p.bookingReference}\n`);
  }
  console.log(`Issued ${passes.length} passes. Each code only works for that hunt's team/session.\n`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
