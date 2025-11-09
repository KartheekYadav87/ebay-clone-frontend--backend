"use client";

import React from 'react';
import { Facebook, Twitter, ChevronDown } from 'lucide-react';

const buyLinks = [
  { href: "#", text: "Registration" },
  { href: "#", text: "Bidding & buying help" },
  { href: "#", text: "Stores" },
  { href: "#", text: "Creator Collections" },
  { href: "#", text: "eBay for Charity" },
  { href: "#", text: "Charity Shop" },
  { href: "#", text: "Seasonal Sales and events" },
  { href: "#", text: "eBay Gift Cards" },
];

const sellLinks = [
  { href: "#", text: "Start selling" },
  { href: "#", text: "How to sell" },
  { href: "#", text: "Business sellers" },
  { href: "#", text: "Affiliates" },
];

const toolsAndAppsLinks = [
  { href: "#", text: "Developers" },
  { href: "#", text: "Security center" },
  { href: "#", text: "Site map" },
];

const ebayCompaniesLinks = [
  { href: "#", text: "TCGplayer" },
];

const aboutEbayLinks = [
  { href: "#", text: "Company Info" },
  { href: "#", text: "News" },
  { href: "#", text: "Deferred Prosecution Agreement" },
  { href: "#", text: "Investors" },
  { href: "#", text: "Careers" },
  { href: "#", text: "Diversity & Inclusion" },
  { href: "#", text: "Global Impact" },
  { href: "#", text: "Government relations" },
  { href: "#", text: "Advertise with us" },
  { href: "#", text: "Policies" },
];

const communityLinks = [
  { href: "#", text: "Announcements" },
  { href: "#", text: "eBay Community" },
  { href: "#", text: "eBay for Business Podcast" },
];

const helpAndContactLinks = [
  { href: "#", text: "Seller Center" },
  { href: "#", text: "Contact Us" },
  { href: "#", text: "eBay Returns" },
  { href: "#", text: "eBay Money Back Guarantee" },
];

const legalLinks = [
  { href: "#", text: "Accessibility" },
  { href: "#", text: "User Agreement" },
  { href: "#", text: "Privacy" },
  { href: "#", text: "Consumer Health Data" },
  { href: "#", text: "Payments Terms of Use" },
  { href: "#", text: "Cookies" },
  { href: "#", text: "CA Privacy Notice" },
];

const LinkList = ({ links }: { links: { href: string; text: string }[] }) => (
  <ul className="space-y-2.5">
    {links.map((link) => (
      <li key={link.text}>
        <a href={link.href} className="text-xs text-text-secondary hover:underline">
          {link.text}
        </a>
      </li>
    ))}
  </ul>
);

const AdChoiceIcon = () => (
    <svg className="inline-block ml-0.5" width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 7.5C15 11.6421 11.6421 15 7.5 15C3.35786 15 0 11.6421 0 7.5C0 3.35786 3.35786 0 7.5 0C11.6421 0 15 3.35786 15 7.5Z" fill="#3665F3"/>
        <path d="M7.875 5.625C8.2408 5.625 8.53125 5.33455 8.53125 4.96875C8.53125 4.60295 8.2408 4.3125 7.875 4.3125C7.5092 4.3125 7.21875 4.60295 7.21875 4.96875C7.21875 5.33455 7.5092 5.625 7.875 5.625Z" fill="white"/>
        <path d="M7.125 6.75H8.625V10.5H7.125V6.75Z" fill="white"/>
        <path d="M15 7.5L18 9.5V5.5L15 7.5Z" fill="#3665F3"/>
    </svg>
);

const PrivacyChoiceIcon = () => (
    <svg className="inline-block ml-0.5" width="26" height="14" viewBox="0 0 26 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25.334 0.666016H10.0007L12.6673 3.33268H22.6673V8.66602H18.0007L15.334 11.3327H25.334V0.666016Z" fill="#3665F3"/>
        <path d="M1.33333 13.3327L12.6667 1.99935" stroke="#3665F3" strokeWidth="2"/>
        <path d="M10.6673 5.33268L5.00065 10.9993L2.00065 7.99935" stroke="#3665F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const USFlagIcon = () => (
    <svg width="20" height="15" viewBox="0 0 20 15" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="shrink-0">
        <path fill="#fff" d="M0 0h20v15H0z"/>
        <path fill="#B22234" d="M0 0h20v1.5H0zm0 3h20v1.5H0zm0 3h20v1.5H0zm0 3h20v1.5H0zm0 3h20v1.5H0zm0 3h20v1.5H0z"/>
        <path fill="#002868" d="M0 0h10v7.5H0z"/>
    </svg>
);

export default function Footer() {
  return (
    <footer className="bg-background-secondary pt-8 pb-10 font-body">
      <div className="mx-auto max-w-[1280px] px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-8">
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold text-text-primary mb-3">Buy</h3>
            <LinkList links={buyLinks} />
          </div>
          <div className="lg:col-span-2 space-y-7">
            <div>
              <h3 className="text-xs font-bold text-text-primary mb-3">Sell</h3>
              <LinkList links={sellLinks} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-text-primary mb-3">Tools & apps</h3>
              <LinkList links={toolsAndAppsLinks} />
            </div>
          </div>
          <div className="lg:col-span-2 space-y-7">
            <div>
              <h3 className="text-xs font-bold text-text-primary mb-3">eBay companies</h3>
              <LinkList links={ebayCompaniesLinks} />
            </div>
            <div>
                <h3 className="text-xs font-bold text-text-primary mb-3">Stay connected</h3>
                <div className="flex space-x-4">
                    <a href="#" aria-label="Facebook"><Facebook className="h-6 w-6 text-text-secondary" /></a>
                    <a href="#" aria-label="X/Twitter"><Twitter className="h-6 w-6 text-text-secondary" /></a>
                </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold text-text-primary mb-3">About eBay</h3>
            <LinkList links={aboutEbayLinks} />
          </div>
          <div className="lg:col-span-3 space-y-7">
            <div>
              <h3 className="text-xs font-bold text-text-primary mb-3">Help & Contact</h3>
              <LinkList links={helpAndContactLinks} />
            </div>
            <div>
              <h3 className="text-xs font-bold text-text-primary mb-3">Community</h3>
              <LinkList links={communityLinks} />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-border flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p className="text-[11px] text-text-secondary whitespace-nowrap">Copyright © 1995-2024 eBay Inc. All Rights Reserved.</p>
            <nav>
              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
                {legalLinks.map(link => (
                  <li key={link.text}>
                    <a href={link.href} className="text-xs text-primary hover:underline">{link.text}</a>
                  </li>
                ))}
                <li>
                  <a href="#" className="text-xs text-primary hover:underline whitespace-nowrap">
                    Your Privacy Choices
                    <PrivacyChoiceIcon />
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs text-primary hover:underline whitespace-nowrap">
                    AdChoice
                    <AdChoiceIcon />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex justify-start xl:justify-end">
             <button className="flex items-center gap-x-1.5 rounded-[4px] border border-gray-400 px-2 py-1 text-xs text-text-primary hover:border-text-primary">
                <USFlagIcon />
                <span>United States</span>
                <ChevronDown className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}