import React from "react";

const footerSections = [
  {
    title: "Company",
    links: [
      { title: "About", href: "#" },
      { title: "Careers", href: "#" },
      { title: "Brand Center", href: "#" },
      { title: "Blog", href: "#" },
    ],
  },
  {
    title: "Help center",
    links: [
      { title: "Discord Server", href: "#" },
      { title: "Twitter", href: "#" },
      { title: "Facebook", href: "#" },
      { title: "Contact Us", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { title: "Privacy Policy", href: "#" },
      { title: "Licensing", href: "#" },
      { title: "Terms & Conditions", href: "#" },
    ],
  },
  {
    title: "Download",
    links: [
      { title: "iOS", href: "#" },
      { title: "Android", href: "#" },
      { title: "Windows", href: "#" },
      { title: "MacOS", href: "#" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-card mt-20">
      <div className="mx-auto container">
        <div className="grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">
                {section.title}
              </h2>
              <ul className="text-gray-500 dark:text-gray-400 font-medium">
                {section.links.map((link) => (
                  <li key={link.title} className="mb-4">
                    <a href={link.href} className="hover:underline">
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="px-4 py-6 bg-gray-100 dark:bg-gray-700 md:flex md:items-center md:justify-between">
          <span className="text-sm text-gray-500 dark:text-gray-300 sm:text-center">
            © 2023 <a href="https://flowbite.com/">Flowbite™</a>. All Rights
            Reserved.
          </span>

          <div className="flex mt-4 sm:justify-center md:mt-0 space-x-5 rtl:space-x-reverse">
            {/* Social links go here – you can use mapping too if you extract them */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
