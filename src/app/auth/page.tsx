import type { Metadata } from "next";
import { AuthPageForm } from "@/components/auth/AuthPageForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { DEFAULT_AUTH_REDIRECT, TOKEN_STORAGE_KEY } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in — The Marco Passport",
  description:
    "Sign in or create your The Marco Passport account to save places and plan your visits.",
};

// The token lives in localStorage (sessionStorage if the visitor rejected
// cookies), so the server can't tell a signed-in visitor apart. This runs
// before the form paints and sends them on instead (same rules as
// getSafeRedirect in @/lib/auth).
const redirectIfSignedIn = `(function(){try{
var k=${JSON.stringify(TOKEN_STORAGE_KEY)};
if(!localStorage.getItem(k)&&!sessionStorage.getItem(k))return;
var r=new URLSearchParams(location.search).get("redirect")||"";
var ok=r.charAt(0)==="/"&&r.charAt(1)!=="/"&&r.charAt(1)!=="\\\\"&&r.indexOf("/auth")!==0;
document.documentElement.setAttribute("data-auth-redirect","");
location.replace(ok?r:${JSON.stringify(DEFAULT_AUTH_REDIRECT)});
}catch(e){}})();`;

export default function AuthPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: redirectIfSignedIn }} />
      <AuthShell>
        <AuthPageForm />
      </AuthShell>
    </>
  );
}
