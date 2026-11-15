import {createFileRoute} from "@tanstack/react-router";
import {StoreContent} from "@/components/site/StoreContent";
import {pageMeta} from "@/lib/meta";
export const Route=createFileRoute("/cookies")({head:()=>pageMeta("Cookie Policy","Cookie Policy for the Mindixo digital bookstore."),component:()=> <StoreContent field="cookies" title="Cookie Policy"/>});
