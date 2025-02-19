import { SignInForm } from "@/app/auth/_components/signin-form";

export default async function SignInModal({
  searchParams
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const params = await searchParams
  return <SignInForm callbackUrl={params.callbackUrl} />
} 