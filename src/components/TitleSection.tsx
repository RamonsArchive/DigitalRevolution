import React from "react";

interface TitleSectionProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  titleClassName?: string;
  descriptionClassName?: string;
  containerClassName?: string;
}

const TitleSection = ({
  title,
  description,
  titleClassName,
  descriptionClassName,
  containerClassName,
}: TitleSectionProps) => {
  return (
    <div
      className={`bg-gradient-to-b from-bg-primary via-secondary-900 to-bg-primary ${containerClassName}`}
    >
      <h1 className={`text-white ${titleClassName}`}>{title}</h1>
      <p className={`text-white/90 ${descriptionClassName}`}>{description}</p>
    </div>
  );
};

export default TitleSection;
