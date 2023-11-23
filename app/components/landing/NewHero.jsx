import { useState } from "react";
import { Dialog } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

export default function NewHero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('common')


  return (
    <section className="relative">
      <div className="bg-white">
        <header className="absolute inset-x-0 top-0 z-99">
          <Dialog
            as="div"
            className="lg:hidden"
            open={mobileMenuOpen}
            onClose={setMobileMenuOpen}
          >
            <div className="fixed inset-0 z-50" />
            <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <a href="#" className="-m-1.5 p-1.5">
                  <span className="sr-only">{t('new_hero_your_company')}</span>
                  <Image
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=violet&shade=600"
                    alt=""
                  />
                </a>
                <button
                  type="button"
                  className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">{t('new_hero_close_menu')}</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-6 flow-root">
                <div className="-my-6 divide-y divide-gray-500/10">
                  <div className="space-y-2 py-6">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                  <div className="py-6">
                    <a
                      href="#"
                      className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                    >
                      {t('new_hero_login')}
                    </a>
                  </div>
                </div>
              </div>
            </Dialog.Panel>
          </Dialog>
        </header>

        <div className="relative isolate px-6 pt-14 lg:px-8 pb-16">
          <div className="hero">
            <div
              className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              aria-hidden="true"
            >
              <div
                className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#8202a676] to-[#8832ea] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style={{
                  clipPath:
                    "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                }}
              />
            </div>
            <div>
              <div className="mx-auto max-w-2xl  pt-8 sm:pb-12 lg:pb-32">
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                  <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
                    {t('new_hero_get_tips')}{" "}
                    <Link
                      href="https://join.slack.com/t/prospcommunity/shared_invite/zt-1zrpgmze8-BfkB3uXuVFTVxRXkTxPPBw"
                      className="font-semibold text-violet-600"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      {t('new_hero_slack')} <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </div>
                </div>

                <div className="text-center">
                  <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    {t('new_hero_book_meetings')}{" "}
                    <span className="bg-gradient-to-r from-violet-400 to-violet-700 bg-clip-text text-transparent">
                      {t('new_hero_with_ai')}
                    </span>
                  </h1>
                  <p className="hidden md:block mt-6 text-lg leading-8 text-gray-600">
                    {t('new_hero_craft_1')}{" "}
                    <br />
                    {t('new_hero_craft_2')}
                  </p>

                  <p className="block md:hidden mt-6 text-lg leading-8 text-gray-600">
                    {t('new_hero_craft_3')}
                  </p>

                  <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-2">
                    <Link
                      href="/login"
                      className="text-md rounded-md bg-violet-600 px-3.5 border border-violet-600 py-2.5 font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    >

                      {t('new_hero_get_started')}
                    </Link>
                    <Link
                      href="/login"
                      className="hidden items-center text-md rounded-md px-3.5 py-2.5 border border-black font-semibold text-black shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
                    >
                      {t('new_hero_watch_video')}{" "}
                      <PlayCircleIcon
                        className="h-5 w-5 ml-2"
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-32 -z-10 transform-gpu overflow-hidden blur-3xl top-[calc(100%+12rem)] lg:top-[calc(100%-10rem)]  sm:right-[calc(100%-100rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(%+100rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-violet-400 to-violet-600 opacity-30 md:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
