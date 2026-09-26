import crypto from "crypto";

const SECRET = process.env.AUTH_SECRET || "dev-secret";

export function signCompletion(payload: {
  teamId: string;
  sessionId: string;
  stopIndex: number;
  challengeId: string;
  displayNumber: string;
}): string {
  const data = `${payload.teamId}|${payload.sessionId}|${payload.stopIndex}|${payload.challengeId}|${payload.displayNumber}`;
  return crypto.createHmac("sha256", SECRET).update(data).digest("hex");
}

export function verifyCompletionSignature(
  payload: {
    teamId: string;
    sessionId: string;
    stopIndex: number;
    challengeId: string;
    displayNumber: string;
  },
  signature: string
): boolean {
  const expected = signCompletion(payload);
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
