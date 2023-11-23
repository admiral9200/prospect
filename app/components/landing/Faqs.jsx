import Link from "next/link";

import { Container } from "@/app/components/landing/Container";
import { useTranslations } from 'next-intl';

// The rest of your code here...

export function Faqs() {
  const t = useTranslations('common')
  const faqs = [
    [
      {
        question: t('faq_question_1'),
        answer: t('faq_answer_1'),
      },
      {
        question: t('faq_question_2'),
        answer: t('faq_answer_2'),
      },
      {
        question: t('faq_question_3'),
        answer: t('faq_answer_3'),
      },
    ],
    [
      {
        question: t('faq_question_4'),
        answer: t('faq_answer_4'),
      },
      {
        question: t('faq_question_5'),
        answer: t('faq_answer_5'),
      },
      {
        question: t('faq_question_6'),
        answer: t('faq_answer_6'),
      },
    ],
    [
      {
        question: t('faq_question_7'),
        answer: t('faq_answer_7'),
      },
      {
        question: t('faq_question_8'),
        answer: t('faq_answer_8'),
      },
      {
        question: t('faq_question_9'),
        answer: t('faq_answer_9'),
      },
    ],
  ];
  return (
    <section
      id="faqs"
      aria-labelledby="faqs-title"
      className="border-t border-gray-200 py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2
            id="faqs-title"
            className="text-3xl font-medium tracking-tight text-gray-900"
          >
            {t('faq_title')}
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            {t('faq_desc')}{" "}
            <Link
              href="mailto:yann@prosp.ai"
              className="text-gray-900 underline"
            >
              {t('faq_reach')}
            </Link>
            .
          </p>
        </div>
        <ul
          role="list"
          className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:max-w-none lg:grid-cols-3"
        >
          {faqs.map((column, columnIndex) => (
            <li key={columnIndex}>
              <ul role="list" className="space-y-10">
                {column.map((faq, faqIndex) => (
                  <li key={faqIndex}>
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="mt-4 text-sm text-gray-700">{faq.answer}</p>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
