import React from "react";
import Link from "next/link";

interface Props {
  title: string;
  containerClassName?: string;
  titleClassName?: string;
}

const DonateButton = ({ title, containerClassName, titleClassName }: Props) => {
  return (
    <div className={`${containerClassName}`}>
      <Link
        href={"/donate"}
        className={`${titleClassName} donate-gradient-btn px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95`}
      >
        {title}
      </Link>
    </div>
  );
};

export default DonateButton;
