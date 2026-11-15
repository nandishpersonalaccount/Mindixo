import {createFileRoute} from "@tanstack/react-router";
import {StoreContent} from "@/components/site/StoreContent";
import {pageMeta} from "@/lib/meta";
export const Route=createFileRoute("/delivery")({head:()=>pageMeta("Digital Delivery","Digital Delivery for the Mindixo digital bookstore."),component:()=> <StoreContent field="delivery" title="Digital Delivery"/>});
