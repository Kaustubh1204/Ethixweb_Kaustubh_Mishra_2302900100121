import { Instrument_Serif } from "next/font/google";
import "./stacked-heading.css";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

type Props = {
  pill?: string;
  top?: string;
  italic?: string;
  bottom?: string;
  tagline?: string;
  eyebrow?: string;
};

export default function StackedHeading({
  pill = "ETHIXWEB",
  top = "About",
  italic,
  bottom,
  tagline = "Changing the way you think of the planet.",
  eyebrow = "INTERNATIONALLY RECOGNISED",
}: Props) {
  // If only a single word or heading is given and italic/bottom are identical or not provided,
  // display it cleanly as a single prominent title instead of repeating it 3 times.
  const isSingleWord = !bottom || (top === italic && italic === bottom);

  return (
    <section className={`sh-wrap ${serif.className}`}>
      {pill && <span className="sh-pill">{pill}</span>}

      <h1 className="sh-title">
        {isSingleWord ? (
          <span className="sh-line">{top}</span>
        ) : (
          <>
            <span className="sh-line">{top}</span>
            {italic && <span className="sh-line sh-italic">{italic}</span>}
            {bottom && <span className="sh-line">{bottom}</span>}
          </>
        )}
      </h1>

      {tagline && <p className="sh-tagline">{tagline}</p>}
      {eyebrow && <span className="sh-eyebrow">{eyebrow}</span>}
    </section>
  );
}
