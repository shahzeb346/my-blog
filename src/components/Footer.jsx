export default function Footer() {
  return (
    <footer className="bg-gray-300 py-6">
      <div className=" flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">
        <div>
          <h1 className="mb-2 text-2xl font-bold sm:text-3xl">The Chronicle</h1>
          <p className="text-sm text-gray-700 sm:text-base">
            2026 The Chronicle. All rights are reserved
          </p>
        </div>

        <div>
          <ul className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 md:justify-end">
            <li>
              <a href="" className="underline hover:text-gray-900">
                About Us
              </a>
            </li>
            <li>
              <a href="" className="underline hover:text-gray-900">
                Contact
              </a>
            </li>
            <li>
              <a href="" className="underline hover:text-gray-900">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="" className="underline hover:text-gray-900">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="" className="underline hover:text-gray-900">
                Newsletter
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}