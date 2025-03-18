import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface FAQ {
  question: string;
  answer: string;
}

export default function FAQSection() {
  const faqs: FAQ[] = [
    {
      question: "How does the referral system work?",
      answer: "When users buy or sell Hacked ATM through your referral link, an 8% fee is applied to the transaction. 5% goes directly to you as the referrer, 2% goes to the staking rewards pool, and 1% goes to the marketing wallet. Your referral link is generated automatically when you connect your wallet."
    },
    {
      question: "What is the staking lock period?",
      answer: "When you stake Hacked ATM tokens, there's a 7-day lock period. If you unstake before this period ends, you'll incur a 5% early withdrawal fee that will be burned from your staked amount, which helps maintain token scarcity."
    },
    {
      question: "How are staking rewards calculated?",
      answer: "Staking rewards are calculated based on two factors: transaction volume and total tokens staked. 2% of every buy and sell transaction goes to the staking rewards pool, which is distributed proportionally to all stakers every 30 minutes. Higher transaction volume means higher APY, while more tokens staked means the rewards are distributed among more users."
    },
    {
      question: "How do I get on the leaderboard?",
      answer: "There are two leaderboards: Top Referrers and Top Stakers. To get on the Top Referrers leaderboard, you need to generate more referrals than other users. To get on the Top Stakers leaderboard, you need to stake more tokens than other users. The leaderboards reset weekly and monthly, giving everyone a chance to earn rewards."
    },
    {
      question: "What rewards do leaderboard winners get?",
      answer: "Leaderboard winners receive multiple benefits: airdropped HOTPEPE tokens, extra staking APY bonuses (for top stakers), and recognition on our website and social media channels. The top referrer and top staker also receive exclusive access to new features and early participation in upcoming projects."
    }
  ];

  return (
    <section id="faq" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Learn more about Hacked ATM token and how our systems work.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-400">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
