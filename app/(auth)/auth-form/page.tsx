import { AuthForm } from "@/app/auth/_components/auth-form";


export default async function AuthModal({
  searchParams
}: {
  searchParams: Promise<{ callbackUrl?: string }>
}) {
  const params = await searchParams
  return <AuthForm callbackUrl={params.callbackUrl} />
} 