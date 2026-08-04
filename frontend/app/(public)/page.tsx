import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
} from "lucide-react"
import HeaderSection from "../customComponents/PublicComponents/HeaderSection/HeaderSection"
import { SubjectsCards } from "../customComponents/PublicComponents/Subjects/SubjectsCards"



const questionBanks = [
  {
    title: "বিসিএস (BCS)",
    description: "প্রিলিমিনারি, লিখিত ও বিশেষ বিসিএস পরীক্ষার প্রশ্নব্যাংক",
    questions: "১০,০০০+ প্রশ্ন",
    href: "/question-banks/bcs",
  },
  {
    title: "এনটিআরসিএ (NTRCA)",
    description: "স্কুল, স্কুল-২ ও কলেজ শিক্ষক নিবন্ধন পরীক্ষার প্রশ্ন",
    questions: "৫,০০০+ প্রশ্ন",
    href: "/question-banks/ntrca",
  },
  {
    title: "পিএসসি নন-ক্যাডার নিয়োগ পরীক্ষা",
    description: "পিএসসি কর্তৃক অনুষ্ঠিত নন-ক্যাডার নিয়োগ পরীক্ষার প্রশ্ন",
    questions: "৮,০০০+ প্রশ্ন",
    href: "/question-banks/psc-non-cadre",
  },
  {
    title: "ব্যাংক নিয়োগ পরীক্ষা",
    description:
      "বাংলাদেশ ব্যাংক ও সরকারি/বেসরকারি ব্যাংক নিয়োগ পরীক্ষার প্রশ্ন",
    questions: "৬,০০০+ প্রশ্ন",
    href: "/question-banks/bank",
  },
  {
    title: "সরকারি নিয়োগ পরীক্ষা",
    description:
      "বিভিন্ন মন্ত্রণালয়, অধিদপ্তর ও সরকারি প্রতিষ্ঠানের নিয়োগ পরীক্ষা",
    questions: "১২,০০০+ প্রশ্ন",
    href: "/question-banks/government",
  },
  {
    title: "প্রতিরক্ষা ও আইনশৃঙ্খলা বাহিনী",
    description:
      "সেনাবাহিনী, নৌবাহিনী, বিমান বাহিনী, পুলিশ, বিজিবি ও অন্যান্য বাহিনী",
    questions: "৪,০০০+ প্রশ্ন",
    href: "/question-banks/defence",
  },
  {
    title: "স্বাস্থ্য ও চিকিৎসা",
    description:
      "স্বাস্থ্য অধিদপ্তর, নার্সিং, মেডিকেল ও স্বাস্থ্যসেবা নিয়োগ পরীক্ষা",
    questions: "৩,০০০+ প্রশ্ন",
    href: "/question-banks/health",
  },
  {
    title: "বিশ্ববিদ্যালয় ভর্তি পরীক্ষা",
    description: "বিশ্ববিদ্যালয়, মেডিকেল ও প্রকৌশল ভর্তি পরীক্ষার প্রশ্ন",
    questions: "৭,০০০+ প্রশ্ন",
    href: "/question-banks/admission",
  },
  {
    title: "প্রাথমিক ও শিক্ষক নিয়োগ",
    description:
      "প্রাথমিক শিক্ষক, সরকারি বিদ্যালয় ও অন্যান্য শিক্ষক নিয়োগ পরীক্ষা",
    questions: "৪,০০০+ প্রশ্ন",
    href: "/question-banks/teacher",
  },
  {
    title: "অন্যান্য",
    description:
      "স্বায়ত্তশাসিত প্রতিষ্ঠান, কর্পোরেশন ও অন্যান্য প্রতিযোগিতামূলক পরীক্ষা",
    questions: "২,০০০+ প্রশ্ন",
    href: "/question-banks/others",
  },
]
const modelTests = [
  {
    title: "BCS Full Model Test 01",
    description: "পূর্ণাঙ্গ বিসিএস প্রিলিমিনারি মডেল পরীক্ষা",
    meta: "১০০ প্রশ্ন • ৬০ মিনিট",
    href: "/mock-exams/bcs/1",
  },
  {
    title: "Bangladesh Affairs Test",
    description: "বাংলাদেশ বিষয়াবলির উপর বিশেষ মডেল টেস্ট",
    meta: "৫০ প্রশ্ন • ৩০ মিনিট",
    href: "/mock-exams/bangladesh-affairs",
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}

      <HeaderSection></HeaderSection>
      {/* Subjects */}
      <SubjectsCards></SubjectsCards>

      {/* Question Banks */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Question Banks"
            title="প্রশ্নব্যাংক"
            description="বিসিএস, এনটিআরসিএ, ব্যাংক, সরকারি চাকরি, ভর্তি পরীক্ষা ও অন্যান্য প্রতিযোগিতামূলক পরীক্ষার প্রশ্ন অনুশীলন করুন।"
            href="/question-banks"
            linkText="সব প্রশ্নব্যাংক"
          />

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {questionBanks.map((bank) => (
              <Link
                key={bank.title}
                href={bank.href}
                className="group rounded-xl border bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <BookOpen className="size-5" />
                  </div>

                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                    {bank.questions}
                  </span>
                </div>

                <h3 className="mt-5 font-semibold">{bank.title}</h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {bank.description}
                </p>

                <div className="mt-6 flex items-center text-sm font-medium text-primary">
                  প্রশ্ন দেখুন
                  <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Model Tests */}
      <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Mock Exams"
          title="মডেল পরীক্ষা"
          description="পরীক্ষার মতো পরিবেশে সময় ধরে নিজের প্রস্তুতি যাচাই করুন।"
          href="/mock-exams"
          linkText="সব মডেল পরীক্ষা"
        />

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {modelTests.map((test) => (
            <Link
              key={test.title}
              href={test.href}
              className="group flex flex-col justify-between rounded-xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-center"
            >
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ClipboardCheck className="size-5" />
                  </div>

                  <h3 className="font-semibold">{test.title}</h3>
                </div>

                <p className="mt-4 text-sm text-muted-foreground">
                  {test.description}
                </p>

                <p className="mt-2 text-xs font-medium text-muted-foreground">
                  {test.meta}
                </p>
              </div>

              <div className="mt-5 inline-flex items-center text-sm font-medium text-primary sm:mt-0">
                পরীক্ষা দিন
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
            <GraduationCap className="mx-auto size-10" />

            <h2 className="mt-5 text-2xl font-bold sm:text-3xl">
              আপনার প্রস্তুতি আজই শুরু করুন
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 opacity-90 sm:text-base">
              বিনামূল্যে অ্যাকাউন্ট তৈরি করুন এবং প্রশ্ন অনুশীলন, মডেল পরীক্ষা ও
              আপনার প্রস্তুতির অগ্রগতি এক জায়গা থেকে পরিচালনা করুন।
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex h-11 items-center justify-center rounded-md bg-background px-6 text-sm font-semibold text-foreground transition-colors hover:bg-background/90"
              >
                শুরু করুন
              </Link>

              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-md border border-primary-foreground/30 px-6 text-sm font-medium transition-colors hover:bg-primary-foreground/10"
              >
                লগইন করুন
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkText,
}: {
  eyebrow: string
  title: string
  description: string
  href: string
  linkText: string
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-primary">{eyebrow}</p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>

      <Link
        href={href}
        className="inline-flex shrink-0 items-center text-sm font-medium text-primary hover:underline"
      >
        {linkText}
        <ArrowRight className="ml-1 size-4" />
      </Link>
    </div>
  )
}
