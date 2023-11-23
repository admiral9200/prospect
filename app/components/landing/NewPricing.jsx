import { useState } from "react";
import { useRouter } from "next/navigation";
import { RadioGroup } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useTranslations } from 'next-intl';
import useLangParam from "@/app/hooks/useLangParam";

const frequencies = [
  { value: "monthly", label: "Monthly", priceSuffix: "/month" },
  {
    value: "annually",
    label: "Annually",
    priceSuffix: "/month paid annually",
  },
];


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function NewPricing() {
  const t = useTranslations('common')
  const lang = useLangParam()

const tiers = [
  {
    name: "Free Trial",
    id: "tier-free",
    href: "#",
    priceId: { monthly: "none", annually: "none" },
    price: { monthly: t('new_pricing_tiers_1_price_monthly'), annually: t('new_pricing_tiers_1_price_annually') },
    description: t('new_pricing_tiers_1_description'),
    features: [
      t('new_pricing_tiers_1_features_1'),
      t('new_pricing_tiers_1_features_2'),
      t('new_pricing_tiers_1_features_3'),
      t('new_pricing_tiers_1_features_4'),
    ],
    mostPopular: false,
    contactUs: false,
    freeTier: true,
  },
  {
    name: "Pro",
    id: "tier-pro",
    href: "#",
    priceId: {
      monthly: "price_1NDMwlIkovXCkJrGR7mC6lhG",
      annually: "price_1NDMv2IkovXCkJrGRlQfZUXr",
    },
    price: { monthly: t('new_pricing_tiers_2_price_monthly'), annually: t('new_pricing_tiers_2_price_annually') },
    description: t('new_pricing_tiers_2_description'),
    features: [
      t('new_pricing_tiers_2_features_1'),
      t('new_pricing_tiers_2_features_2'),
      t('new_pricing_tiers_2_features_3'),
    ],
    mostPopular: true,
    contactUs: false,
  },

  {
    name: "Enterprise",
    id: "tier-enterprise",
    href: "#",
    priceId: { monthly: "none", annually: "none" },
    price: { monthly: t('new_pricing_tiers_3_price_monthly'), annually: t('new_pricing_tiers_3_price_annually') },
    description: t('new_pricing_tiers_3_description'),
    features: [
      t('new_pricing_tiers_3_features_1'),
      t('new_pricing_tiers_3_features_2'),
      t('new_pricing_tiers_3_features_3'),
      t('new_pricing_tiers_3_features_4'),
    ],
    mostPopular: false,
    contactUs: true,
  },
];
  const [frequency, setFrequency] = useState(frequencies[1]);
  const router = useRouter(); // Add this line

  const handleSelectPlan = (tier) => {
    if (tier.name === "Hobbyist") {
      router.push(`${lang}/login`);
    } else if (tier.name === "Enterprise") {
      window.location.href = "mailto:yann@prosp.ai";
    } else {
      router.push(`${lang}/login`);
      localStorage.setItem("selectedPlan", tier.priceId[frequency.value]);
    }
  };

  return (
    <div id="pricing" className="bg-white py-12 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-violet-600">
            {t('new_pricing_pricing')}
          </h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t('new_pricing_pricing_plan_title')}
          </p>
        </div>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-gray-600">
          {t('new_pricing_pricing_plan_desc')}
        </p>
        <div className="mt-16 flex justify-center">
          <RadioGroup
            value={frequency}
            onChange={(e) => {
              console.log(e);
              setFrequency(e)
            }}
            className="grid grid-cols-2 gap-x-1 rounded-full p-1 text-center text-xs font-semibold leading-5 ring-1 ring-inset ring-gray-200"
          >
            <RadioGroup.Label className="sr-only">
              {/* {t('new_pricing_pay_freq')} */}
              Payment frequency
            </RadioGroup.Label>
            {frequencies.map((option) => (
              <RadioGroup.Option
                key={option.value}
                value={option}
                className={({ checked }) =>
                  classNames(
                    checked ? "bg-violet-600 text-white" : "text-gray-500",
                    "cursor-pointer rounded-full px-2.5 py-1"
                  )
                }
              >
                <span>{option.label}</span>
              </RadioGroup.Option>
            ))}
          </RadioGroup>
        </div>
        <div className="isolate mx-auto mt-10 grid max-w-md grid-cols-1 gap-8 md:max-w-2xl md:grid-cols-2 lg:max-w-1xl xl:mx-0 xl:max-w-none xl:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.mostPopular
                  ? "ring-2 ring-violet-600"
                  : "ring-1 ring-gray-200",
                "rounded-3xl p-8"
              )}
            >
              <h3
                id={tier.id}
                className={classNames(
                  tier.mostPopular ? "text-violet-600" : "text-gray-900",
                  "text-lg font-semibold leading-8"
                )}
              >
                {tier.name}
              </h3>
              <div className="h-24 overflow-y-hidden">
                <p className="mt-4 text-sm leading-6 text-gray-600">
                  {tier.description}
                </p>
              </div>
              {tier.freeTier ? (
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {t('new_pricing_free')}
                  </span>
                </p>
              ) : tier.contactUs ? (
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {t('new_pricing_lets_talk')}
                  </span>
                </p>
              ) : (
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className="text-4xl font-bold tracking-tight text-gray-900">
                    {tier.price[frequency.value]}
                  </span>
                  <span className="text-sm font-medium leading-6 text-gray-600">
                    {frequency.priceSuffix}
                  </span>
                </p>
              )}
              <a
                onClick={() => handleSelectPlan(tier)}
                aria-describedby={tier.id}
                className={classNames(
                  tier.mostPopular
                    ? "bg-violet-600 text-white shadow-sm hover:bg-violet-500"
                    : "text-violet-600 ring-1 ring-inset ring-violet-200 hover:ring-violet-300",
                  "mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                )}
              >
                {tier.contactUs
                  ? t('new_pricing_contact_us')
                  : tier.freeTier
                    ? t('new_pricing_talk_for_free')
                    : t('new_pricing_buy_plan')}
              </a>

              <ul
                role="list"
                className="mt-8 space-y-3 text-sm leading-6 text-gray-600"
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <CheckIcon
                      className="h-6 w-5 flex-none text-green-600"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
