import { Helmet } from 'react-helmet-async'
export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet><title>Privacy Policy | CleanNigeria</title></Helmet>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-muted-foreground mb-4">Last updated: May 2026</p>
        <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
        <div className="prose text-muted-foreground space-y-4">
          <p>CleanNigeria is committed to protecting your personal data. This policy explains how we collect, use, and safeguard your information when you use our platform.</p>
          <p>We collect your name, email, phone number, and address to deliver our waste collection services. We do not sell your data to third parties.</p>
          <p>For full policy details, please contact us at privacy@cleannigeria.com</p>
        </div>
      </div>
    </>
  )
}
