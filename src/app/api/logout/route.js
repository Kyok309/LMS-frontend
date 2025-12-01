import { auth } from "@/auth"
export async function POST() {
  const session = await auth();

  if (!session?.user?.accessToken) {
    return Response.json({ message: "Not logged in" }, { status: 401 });
  }

  try {
    const form = new URLSearchParams({
      token: session.user.refreshToken,          // revoke refresh token
      token_type_hint: "refresh_token",
      client_id: process.env.FRAPPE_CLIENT_ID,
      client_secret: process.env.FRAPPE_CLIENT_SECRET,
    });

    const res = await fetch(
      "http://localhost:8000/api/method/frappe.integrations.oauth2.revoke_token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
      }
    );

    if (!res.ok) {
      console.log(await res.text());
      return Response.json({ message: "Frappe revoke failed" }, { status: 500 });
    }

    return Response.json({ message: "Revoked" });
  } catch (err) {
    console.error(err);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
}
