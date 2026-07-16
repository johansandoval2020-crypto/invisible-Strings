/**
 * Layout con parallel route @modal — habilita el patrón de Instagram/
 * Linear: /moments/[id] es una página real y compartible, pero cuando
 * se navega ahí desde /moments (un carrusel o el grid) Next.js la
 * intercepta y la muestra como modal superpuesto en vez de navegar de
 * página completa. Ver docs/ARCHITECTURE.md §5 y la carpeta @modal/.
 */
export default function MomentsLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
