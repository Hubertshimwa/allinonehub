import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { createAdminClient } from "@/lib/supabase/server";

function getFirebaseAdmin() {
  if (getApps().length) return getApps()[0];
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) return null;
  return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) });
}

export async function sendPushNotification(userIds: string[], notification: { title: string; body: string; url?: string }) {
  const app = getFirebaseAdmin();
  if (!app || !userIds.length) return { sent: 0, reason: "Firebase Admin is not configured" };
  const supabase = createAdminClient();
  const { data: devices } = await supabase.from("push_devices").select("token").in("user_id", userIds);
  const tokens = devices?.map((device) => device.token) ?? [];
  if (!tokens.length) return { sent: 0, reason: "No registered devices" };
  const response = await getMessaging(app).sendEachForMulticast({ tokens, notification: { title: notification.title, body: notification.body }, webpush: { fcmOptions: { link: notification.url ?? process.env.NEXT_PUBLIC_APP_URL } } });
  const invalidTokens = response.responses.flatMap((result, index) => result.success ? [] : [tokens[index]]);
  if (invalidTokens.length) await supabase.from("push_devices").delete().in("token", invalidTokens);
  return { sent: response.successCount, failed: response.failureCount };
}
