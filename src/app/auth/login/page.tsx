import AuthDivider from "@/components/auth/auth-divider";
import LoginForm from "@/components/auth/login-form";
import { OAuthButtons } from "@/components/auth/oauth-button";

export default function Page() {
  return (
    <>
      <LoginForm />

      <AuthDivider />
      <OAuthButtons />
    </>
  );
}
