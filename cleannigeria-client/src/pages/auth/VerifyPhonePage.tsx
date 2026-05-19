import { Helmet } from 'react-helmet-async'
export default function VerifyPhonePage() {
  return (
    <>
      <Helmet><title>Verify Phone | CleanNigeria</title></Helmet>
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold">Verify Your Phone</h1>
        <p className="text-muted-foreground text-sm">Enter the 6-digit code sent to your phone number via SMS.</p>
        <p className="text-xs text-muted-foreground">(Same OTP UI as email verification — see VerifyEmailPage for the full component)</p>
      </div>
    </>
  )
}
