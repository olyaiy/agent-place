import { SignUpForm } from "@/app/auth/_components/signup-form";

export default async function SignUpModal({
  searchParams
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const params = await searchParams
  return <SignUpForm callbackUrl={params.callbackUrl} />
} 