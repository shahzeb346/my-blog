import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

export default function Navbar({ activePage, setActivePage }) {
  const [open, setOpen] = useState(false);

  const links = ["News", "Sports", "Health", "Technology"];

  const handleSelect = (link) => {
    setActivePage(link);
    setOpen(false);
  };

  return (
    <header className="border-b-[3px] border-black-200 bg-white">
      <div className="flex mb-2 max-w-6xl items-center justify-between px-4 py-4 ml-20 sm:px-6 lg:px-8">
        <h1 className="font-serif text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
          The Chronicle
        </h1>

        <nav className="hidden items-center ml-20 gap-8 md:flex">
          {links.map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => handleSelect(link)}
              className={`text-sm font-medium transition-colors hover:text-red-700 ${
                activePage === link ? 'text-red-700' : 'text-neutral-700'
              }`}
            >
              {link}
            </button>
          ))}
        </nav>

        <div className="hidden items-center justify-end gap-4 md:flex">
          <div className="relative ml-20">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="search"
              placeholder="Search"
              className="w-40 rounded-full border border-neutral-300 bg-neutral-50 py-1.5 pl-8 pr-3 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700 lg:w-56"
            />
          </div>
          <button className="rounded-full bg-black px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:opacity-50">
            Subscribe
          </button>
          <button className="rounded-full border border-neutral-300 px-4 py-1.5 text-sm font-semibold text-neutral-800 transition-colors hover:border-neutral-900">
            Login
          </button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="inline-flex items-center justify-center rounded-md p-2 text-neutral-800 hover:bg-neutral-100 md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-neutral-200 bg-white px-4 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => handleSelect(link)}
                className={`rounded-md px-2 py-2.5 text-left text-base font-medium ${
                  activePage === link ? 'text-red-700' : 'text-neutral-800'
                } hover:bg-neutral-50 hover:text-red-700`}
              >
                {link}
              </button>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                type="search"
                placeholder="Search"
                className="w-full rounded-full border border-neutral-300 bg-neutral-50 py-2 pl-8 pr-3 text-sm text-neutral-800 placeholder-neutral-400 outline-none focus:border-red-700 focus:ring-1 focus:ring-red-700"
              />
            </div>
            <button className="w-full rounded-full bg-black px-4 py-2 text-sm font-semibold text-white hover:opacity-50">
              Subscribe
            </button>
            <button className="w-full rounded-full border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 hover:border-neutral-900">
              Login
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

