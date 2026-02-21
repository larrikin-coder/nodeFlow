"use client";
import React from "react";
import { FloatingNav } from "./aceternity/navbar";
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
// import {image} from "../public/image.png"

export function FloatingNavDemo() {
  const navItems = [
    {
      name: "NodeFlow",
      link: "/",
    //   icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    icon: <img src="/nodeflow.png" alt="NodeFlow Logo" className="h-4 w-4" />
    },
    {
      name: "Github",
      link: "https://github.com/larrikin-coder/nodeFlow.git",
      icon: <img src="/github.png" alt="Github logo" className="h-4 w-4" />,
    },
    {
      name: "Contact",
      link: "#contact",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];

  return <FloatingNav navItems={navItems} />;
}