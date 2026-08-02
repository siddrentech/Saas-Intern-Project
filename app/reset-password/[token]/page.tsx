import { Suspense } from "react"
import { ResetPasswordForm } from "../reset-password-form"

type ResetPasswordTokenPageProps = {
  params: Promise<{
    token: string
  }>
}

export default async function ResetPasswordTokenPage({
  params,
}: ResetPasswordTokenPageProps) {
  const { token } = await params

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <ResetPasswordForm tokenFromPath={token} />
    </Suspense>
  )
}
