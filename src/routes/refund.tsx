import {createFileRoute} from "@tanstack/react-router";
import {StoreContent} from "@/components/site/StoreContent";
import {pageMeta} from "@/lib/meta";
export const Route=createFileRoute("/refund")({head:()=>pageMeta("Refund Policy","Refund Policy for the Mindixo digital bookstore."),component:()=> <StoreContent field="refund" title="Refund Policy"/>});
