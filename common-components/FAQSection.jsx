"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import clsx from "clsx";
import { ChevronDownIcon } from "lucide-react";
import { Socials } from "./socials/social";
const faqs = [
  {
    question: "What is the NOWA airdrop and how do I join?",
    answer:
      "The NOWA airdrop is a limited-time event where you can claim free NOWA tokens directly into your connected wallet. To participate, connect your wallet on this page and click the Claim button.",
  },
  {
    question: "What happens after claiming?",
    answer:
      "Once claimed, your NOWA tokens are automatically staked, and you start earning rewards instantly based on the set APY.",
  },
  {
    question: "When and how are rewards earned?",
    answer:
      "Earnings start immediately after staking. Rewards are calculated daily on your staked amount and displayed in real time on the dashboard.",
  },
  {
    question: "How much can I claim and how often?",
    answer:
      "The number of tokens depends on the available airdrop pool. Each wallet can claim once every 24 hours during the campaign.",
  },
  {
    question: "Is there a cost to claim?",
    answer:
      "Claiming is free, but a small blockchain network BEP-20 (gas) fee may apply for the transaction.",
  },
];

const FAQSection = () => {
  return (
    <div className="w-full flex justify-center items-center  mt-24 container mx-auto bg-background rounded-2xl">
      <div className="grid grid-cols-12  w-full    gap-5   mx-2 md:mx-0  rounded-2xl overflow-hidden  inset-shadow-2xs shadow-[#0888ff]">
        <div className="col-span-12 md:col-span-6  p-8 md:p-32 flex flex-col gap-6">
          <div className="flex items-center justify-center">
            <p className="text-3xl font-semibold">Follow Us</p>
          </div>
          {/* <div className="mt-12  flex justify-start items-start flex-col ">
            <p className="font-medium">Email Us</p>
            <p className="font-semibold text-2xl">support@nowory.com</p>
          </div>
          <div className=" flex justify-start items-center flex-row gap-4">
            <p className="font-bold text-3xl">Or</p>
          </div>
          <div className=" flex justify-start items-start flex-col">
            <p className="font-semibold text-2xl">Raise a ticket in the app</p>
          </div> */}
          <div className="w-full  flex justify-center items-center">
            <Socials />
          </div>
        </div>
        <div className="col-span-12 md:col-span-6 flex items-start justify-start flex-col">
          <div className="flex items-center justify-center w-full my-12">
            <p className="text-3xl font-semibold">FAQs</p>
          </div>
          <div className="w-full  divide-y divide-white/5 rounded-xl">
            {faqs?.map((item, idx) => {
              return (
                <Disclosure as="div" className="p-6" key={idx}>
                  <DisclosureButton className="group flex w-full items-center justify-between">
                    <span className="text-sm/6 font-medium text-white group-data-hover:text-white/80 text-left">
                      {item?.question}
                    </span>
                    <ChevronDownIcon className="size-5 fill-white/60 group-data-hover:fill-white/50 group-data-open:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel
                    transition
                    className={clsx(
                      "origin-top transition duration-200 ease-out data-closed:-translate-y-6 data-closed:opacity-0",
                      "mt-2 text-sm/5 text-white/90"
                    )}
                  >
                    {item?.answer}
                  </DisclosurePanel>
                </Disclosure>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQSection;
