import {createFileRoute} from "@tanstack/react-router";
import {StoreContent} from "@/components/site/StoreContent";
import {pageMeta} from "@/lib/meta";
export const Route=createFileRoute("/about")({head:()=>pageMeta("About Mindixo","About Mindixo for the Mindixo digital bookstore."),component:()=> <StoreContent field="about" title="About Mindixo"/>});
