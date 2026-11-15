import {createFileRoute} from "@tanstack/react-router";
import {StoreContent} from "@/components/site/StoreContent";
import {pageMeta} from "@/lib/meta";
export const Route=createFileRoute("/dmca")({head:()=>pageMeta("Copyright Policy","Copyright Policy for the Mindixo digital bookstore."),component:()=> <StoreContent field="dmca" title="Copyright Policy"/>});
