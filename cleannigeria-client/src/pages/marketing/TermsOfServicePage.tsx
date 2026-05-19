import { Helmet } from 'react-helmet-async'
export default function TermsOfServicePage() {
  return (
    <>
      <Helmet><title>Terms of Service | CleanNigeria</title></Helmet>
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-sm text-muted-foreground mb-4">Last updated: May 2026</p>
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <div className="prose text-muted-foreground space-y-4">
          <p>By using CleanNigeria, you agree to these terms. Our service provides scheduled waste collection for registered estates and businesses.</p>
          <p>Subscriptions are billed monthly or yearly. Cancellations take effect at the end of the billing period.</p>
          <p>For full terms, contact legal@cleannigeria.com</p>
        </div>
      </div>
    </>
  )
}
