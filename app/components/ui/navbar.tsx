import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Cog6ToothIcon,
  HomeIcon,
  XMarkIcon,
  BeakerIcon,
} from "@heroicons/react/24/outline";

import Link from "next/link";
import MobileNavbar from "./mobile_navbar";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon, current: true },
  {
    name: "Suggestions",
    href: "/suggestions",
    icon: BeakerIcon,
    current: false,
  },
  {
    name: "My Contacts",
    href: "/contacts",
    icon: Cog6ToothIcon,
    current: false,
  },
  {
    name: "My Campaign",
    href: "/campaigns",
    icon: Cog6ToothIcon,
    current: false,
  },
  { name: "My Domains", href: "/domains", icon: Cog6ToothIcon, current: false },
  {
    name: "Settings",
    href: "/account-settings",
    icon: Cog6ToothIcon,
    current: false,
  },
];
const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];
const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({
  sidebarOpen,
  setSidebarOpen,
  modalOpen,
  step,
}) {
  const [current, setCurrent] = useState<string>("/contacts");
  const router = useRouter();

  useEffect(() => {
    console.log(
      "router: ",
      window.location.href.replace("http://localhost:3000", "")
    );
    setCurrent(window.location.href.replace("http://localhost:3000", ""));
  }, [router]);

  return (
    <>
      <div className="">
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-20 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div
                    className={`flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 ${step == 3 && modalOpen ? "bg-gray-500" : "bg-white"
                      }`}
                  >
                    <div className="flex h-16 shrink-0 items-center">
                      <Image
                        src={"/avatar-17.png"}
                        width={40}
                        height={40}
                        alt="Burger"
                        className="rounded-full"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={classNames(
                                    current == item.name
                                      ? "bg-indigo-700 text-white"
                                      : "text-black hover:text-white hover:bg-indigo-700",
                                    "group flex gap-x-3 rounded-md p-2 text-md my-2 leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      item.current
                                        ? "text-white"
                                        : "text-black group-hover:text-white",
                                      "h-6 w-6 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-black">
                            Your teams
                          </div>
                          <ul role="list" className="-mx-2 mt-2 space-y-1">
                            {teams.map((team) => (
                              <li key={team.name}>
                                <a
                                  href={team.href}
                                  className={classNames(
                                    team.current
                                      ? "bg-indigo-700 text-white"
                                      : "text-black hover:text-white hover:bg-indigo-700",
                                    "group flex gap-x-3 rounded-md p-2 text-md my-2 leading-6 font-semibold"
                                  )}
                                >
                                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                                    {team.initial}
                                  </span>
                                  <span className="truncate">{team.name}</span>
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="mt-auto">
                          <a
                            href="#"
                            className="group -mx-2 flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-black hover:bg-indigo-700 hover:text-white"
                          >
                            <Image
                              src={"/logout.svg"}
                              width={30}
                              height={30}
                              alt=""
                            />
                            <p className="text-black text-[18px]">Logout</p>
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-20 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r-[1px] border-gray-300  px-6 pb-4">
            <nav className="flex flex-1 flex-col">
              <ul
                role="list"
                className="flex flex-1 flex-col justify-start items-start gap-y-7"
              >
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name} className="">
                        <Link
                          href={item.href}
                          className={classNames(
                            current == item.href
                              ? "bg-[#6039DB] bg-opacity-[8%] border-[#6039DB] border-[3px] border-opacity-[12%] text-[#6039DB] py-4 rounded-[20px] "
                              : "text-black p-4 rounded-md",
                            "group gap-x-3 rounded-md p-2 text-md my-4 leading-6 font-semibold flex justify-center items-center w-[200px]"
                          )}
                          onClick={(e) => setCurrent(item.href)}
                        >
                          <div className="pl-4 w-full flex justify-start items-center ">
                            <Image
                              src={
                                current == item.href
                                  ? `/navbar/${item.href.replace(
                                    "/",
                                    ""
                                  )}_active.svg`
                                  : `/navbar/${item.href}_inactive.svg`
                              }
                              width={25}
                              height={25}
                              alt=""
                            />
                            <p className="pl-2">{item.name}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-black">
                    Your teams
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current
                              ? "bg-indigo-700 text-white"
                              : "text-black hover:text-white hover:bg-indigo-700",
                            "group flex gap-x-3 rounded-md p-2 text-md my-4 leading-6 font-semibold"
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="mt-auto">
                  <div className="flex justify-between items-center">
                    <Image
                      src={"/avatar-17.png"}
                      width={40}
                      height={40}
                      alt="Burger"
                      className="rounded-full"
                    />
                    <a
                      href="#"
                      className="group -mx-2 flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-black hover:bg-indigo-700 hover:text-white"
                    >
                      <div className="text-white pl-16">
                        <Image
                          src={"/logout.svg"}
                          width={30}
                          height={30}
                          alt=""
                          className="text-black"
                        />
                      </div>
                      <p className="text-black text-[16px] pr-4">Logout</p>
                    </a>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        {/* Mobile navbar*/}
        <div className="-translate-x-6 -translate-y-2 flex flex-col gap-y-5 overflow-y-auto bg-white border-gray-300 px-6 pb-2 lg:hidden">
          <MobileNavbar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      </div>
    </>
  );
}
