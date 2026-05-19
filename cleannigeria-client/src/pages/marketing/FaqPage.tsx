import { Helmet } from 'react-helmet-async'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { buildSeoMeta } from '@/lib/seo'

const faqs = [
  { q: 'How does CleanNigeria work?', a: 'Register online, choose a plan, and we automatically schedule collectors for your zone. On collection day, you get a notification and can track the collector live.' },
  { q: 'How often are collections made?', a: 'Depends on your plan. Basic: 2x/month. Standard: 4x/month. Premium: Unlimited on-demand collections.' },
  { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime from your dashboard. Collections continue until the end of the paid period.' },
  { q: 'Do you cover my area?', a: 'We currently serve Lagos, Abuja, Port Harcourt, Ibadan, Enugu and Kano. Visit the Coverage page to check your specific zone.' },
  { q: 'What payment methods do you accept?', a: 'We accept all Nigerian bank cards, bank transfers, and USSD via our secure Paystack payment gateway.' },
  { q: 'What happens if a collector misses my scheduled pickup?', a: 'We take missed pickups seriously. File a complaint through your dashboard and a makeup pickup will be scheduled within 48 hours, free of charge.' },
  { q: 'Can I upgrade or downgrade my plan?', a: 'Yes, you can change plans anytime from your dashboard. Upgrades take effect immediately with prorated billing.' },
  { q: 'Is there a contract or minimum commitment?', a: 'No long-term contracts. Subscribe monthly or yearly. Yearly plans come with a 20% discount.' },
]

export default function FaqPage() {
  const seo = buildSeoMeta({ title: 'FAQ', description: 'Frequently asked questions about CleanNigeria waste collection services.' })
  return (
    <>
      <Helmet><title>{seo.title}</title></Helmet>
      <section className="gradient-mesh py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center space-y-4">
          <Badge className="bg-brand-50 text-brand-700 border-brand-200">FAQs</Badge>
          <h1 className="text-4xl md:text-5xl font-bold">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">Everything you need to know about CleanNigeria.</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4 md:px-6">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="rounded-xl border border-border px-4">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  )
}
