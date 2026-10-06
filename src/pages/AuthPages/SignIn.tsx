import SignInForm from "@/components/auth/SignInForm";
import PageMeta from "@/components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function SignIn() {
  return (
    <>
      <PageMeta
        title="Masuk | Kerjaindong"
        description="Masuk ke akun Kerjaindong untuk melamar lowongan atau mengelola perusahaan Anda."
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
