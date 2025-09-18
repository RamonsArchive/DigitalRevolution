import React from "react";

interface Props {
  title: string;
  description?: string;
  sources?: string[];
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  sourcesClassName?: string;
}

const CardComponent = ({
  title,
  description,
  sources,
  containerClassName,
  titleClassName,
  descriptionClassName,
  sourcesClassName,
}: Props) => {
  return (
    <div className={`${containerClassName}`}>
      <h1 className={`${titleClassName}`}>{title}</h1>
      <p className={`${descriptionClassName}`}>{description}</p>
      <ul className={`${sourcesClassName}`}>
        {sources?.map((source, index) => (
          <li key={`${source}-${index}`}>{source}</li>
        ))}
      </ul>
    </div>
  );
};

export default CardComponent;
