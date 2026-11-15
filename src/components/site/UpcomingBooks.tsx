const titles = [
  { title: "Psychology", number: "01", theme: "upcoming-psychology" },
  { title: "Manifestation", number: "02", theme: "upcoming-manifestation" },
  { title: "Billionaires Don’t Pay Tax", number: "03", theme: "upcoming-finance" },
];

export function UpcomingBooks() {
  return <div className="mt-10 grid gap-6 sm:grid-cols-3">{titles.map(book => <article key={book.number} className="min-w-0">
    <div className={`upcoming-cover ${book.theme} relative mx-auto flex aspect-[2/3] w-full max-w-72 flex-col justify-between overflow-hidden rounded-md border border-border p-6 shadow-book`}>
      <span className="text-xs font-semibold">M I N D I X O / {book.number}</span>
      <h3 className="break-words font-display text-3xl font-semibold leading-tight">{book.title}</h3>
      <span className="text-xs uppercase">Coming soon</span>
    </div>
    <p className="mt-5 font-display text-lg font-semibold">{book.title}</p>
    <p className="mt-1 text-sm text-muted-foreground">Coming soon</p>
  </article>)}</div>;
}