import { OAuthButtons } from "@/components/auth/oauth-button";
import AuthDivider from "@/components/auth/auth-divider";
import SignUpForm from "@/components/auth/signup-form";

export default function Page() {
  return (
    <>
      <SignUpForm />

      <AuthDivider />
      <OAuthButtons />
    </>
  );
}
