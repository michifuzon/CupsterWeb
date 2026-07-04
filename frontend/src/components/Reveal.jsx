import { useInView } from "../hooks/useInView.js";

export function Reveal({ children, className = "", as: Tag = "div" }) {
  const [ref, inView] = useInView();

  return (
    <Tag ref={ref} className={`reveal ${inView ? "in-view" : ""} ${className}`}>
      {children}
    </Tag>
  );
}
