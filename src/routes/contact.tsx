import {createFileRoute} from "@tanstack/react-router";
import {useStore} from "@/lib/store";
import {pageMeta} from "@/lib/meta";
export const Route=createFileRoute("/contact")({head:()=>pageMeta("Contact","Contact the Mindixo store."),component:Contact});
function Contact(){const {settings:s}=useStore();return <section className="mx-auto max-w-3xl px-6 py-20"><p className="eyebrow">Get in touch</p><h1 className="mt-4 text-4xl font-semibold">Contact Mindixo</h1><div className="mt-8 space-y-5">{s?.email&&<a className="block underline" href={`mailto:${s.email}`}>{s.email}</a>}{s?.phone&&<a className="block" href={`tel:${s.phone}`}>{s.phone}</a>}{s?.address&&<p>{s.address}</p>}{!s?.email&&!s?.phone&&!s?.address&&<p className="text-muted-foreground">Contact details have not been published yet.</p>}</div></section>}
