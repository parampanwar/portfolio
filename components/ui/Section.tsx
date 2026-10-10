import { ReactNode } from "react";
export default function Section({
  id,
  number,
  label,
  children,
}: {
  id: string;
  number: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="editorial-section">
      <div className="container">
        <div className="section-label">
          <span>{number}</span>
          <span>{label}</span>
        </div>
        {children}
      </div>
    </section>
  );
}
