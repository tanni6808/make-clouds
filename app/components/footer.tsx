"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const pathname = usePathname();
  return (
    <div className="bg-white flex justify-center rounded-t-2xl">
      <div className="w-[1000px] p-10 flex justify-between">
        <div className="">&#169;2025 YTN</div>
        <div className="flex items-center gap-4 h-6">
          <Link
            href={"https://github.com/tanni6808/make-clouds"}
            className="flex items-center gap-1 hover:border-b-4 transition-all cursor-pointer"
            target="_blank"
          >
            <FontAwesomeIcon icon={faGithub} />
            <div className="">Github Repo</div>
          </Link>
          {pathname === "/about" ? (
            <div className="flex items-center gap-1 border-b-4 text-primary-light">
              <FontAwesomeIcon icon={faCircleInfo} />
              <div className="">關於本網站</div>
            </div>
          ) : (
            <Link
              href={"/about"}
              className="flex items-center gap-1 hover:border-b-4 transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={faCircleInfo} />
              <div className="">關於本網站</div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
