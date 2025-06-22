"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const handleClickAbout = () => {
    if (confirm("離開頁面將會失去所有編輯進度，確定要離開嗎？"))
      return router.push("/about");
  };
  return (
    <div className="bg-white flex justify-center rounded-t-2xl">
      <div className="w-[1000px] p-10 flex justify-between items-center">
        <div className="">&#169;2025 YTN</div>
        <div className="flex items-center gap-4 min-h-6 max-md:flex-col">
          <Link
            href={"https://github.com/tanni6808/make-clouds"}
            className="h-6 flex items-center gap-1 hover:border-b-4 transition-all cursor-pointer"
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
            <div
              className="h-6 flex items-center gap-1 hover:border-b-4 transition-all cursor-pointer"
              onClick={handleClickAbout}
            >
              <FontAwesomeIcon icon={faCircleInfo} />
              <div className="">關於本網站</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
