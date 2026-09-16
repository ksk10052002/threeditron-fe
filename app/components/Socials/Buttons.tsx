"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import React from "react";

const Buttons = ({
  href,
  image,
  alt,
}: {
  href: string;
  image: string;
  alt: string;
}) => {
  return (
    //   h-10 w-10 bg-red-500 my-2 transition-all duration-300 hover:translate-x-3 hover:scale-110 rounded-xl /*
    <motion.div
      className="md:h-10 md:w-10 h-8 w-8 bg-slate-500 md:my-2 rounded-xl md:scale-100 scale-80"
      whileHover={{
        x: 15,
        scale: 1.2,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 10,
      }}
    >
      <Link href={href} target="_blank" rel="noopener noreferrer">
        <Image src={image} alt={alt} width={100} height={100} />
      </Link>
    </motion.div>
  );
};

export default Buttons;
