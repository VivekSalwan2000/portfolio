import type { ComponentType, CSSProperties } from "react";
import { FaAndroid, FaJava } from "react-icons/fa";
import { SiApachemaven, SiFirebase, SiGithubactions, SiJavascript, SiJunit5, SiPython, SiTensorflow } from "react-icons/si";

type OrbitIcon = {
  Icon: ComponentType<{ className?: string }>;
  label: string;
};

// The stack actually behind this site's own case studies and the
// disciplines marquee — not a generic tech-logo showcase.
const INNER_ORBIT: OrbitIcon[] = [
  { Icon: FaJava, label: "Java" },
  { Icon: FaAndroid, label: "Android" },
  { Icon: SiFirebase, label: "Firebase" },
  { Icon: SiPython, label: "Python" },
];

const OUTER_ORBIT: OrbitIcon[] = [
  { Icon: SiJavascript, label: "JavaScript" },
  { Icon: SiTensorflow, label: "TensorFlow" },
  { Icon: SiGithubactions, label: "GitHub Actions" },
  { Icon: SiApachemaven, label: "Maven" },
  { Icon: SiJunit5, label: "JUnit 5" },
];

function OrbitRing({
  icons,
  radius,
  duration,
  iconSize,
  reverse = false,
}: {
  icons: OrbitIcon[];
  radius: number;
  duration: number;
  iconSize: number;
  reverse?: boolean;
}) {
  return (
    <div
      className="absolute top-1/2 left-1/2 rounded-full border border-dashed border-border-strong/50"
      style={{ width: radius * 2, height: radius * 2, marginLeft: -radius, marginTop: -radius }}
    >
      {icons.map(({ Icon, label }, i) => (
        <div
          key={label}
          title={label}
          className="orbit-icon absolute flex items-center justify-center rounded-full border border-border-strong/60 bg-card text-muted-fg shadow-md"
          style={
            {
              width: iconSize,
              height: iconSize,
              top: "50%",
              left: "50%",
              marginLeft: -iconSize / 2,
              marginTop: -iconSize / 2,
              "--orbit-radius": `${radius}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${-(i / icons.length) * duration}s`,
              animationDirection: reverse ? "reverse" : "normal",
            } as CSSProperties
          }
        >
          <Icon className="h-[42%] w-[42%]" />
        </div>
      ))}
    </div>
  );
}

export function SkillsOrbit() {
  return (
    <div className="relative h-80 w-80 shrink-0" aria-hidden="true">
      <OrbitRing icons={INNER_ORBIT} radius={74} duration={20} iconSize={40} />
      <OrbitRing icons={OUTER_ORBIT} radius={128} duration={30} iconSize={40} reverse />

      <div className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-accent/50 bg-card font-serif text-lg font-semibold text-accent shadow-lg">
        VS
      </div>
    </div>
  );
}
