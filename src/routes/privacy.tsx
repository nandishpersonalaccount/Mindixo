import {createFileRoute} from "@tanstack/react-router";
import {StoreContent} from "@/components/site/StoreContent";
import {pageMeta} from "@/lib/meta";
export const Route=createFileRoute("/privacy")({head:()=>pageMeta("Privacy Policy","Privacy Policy for the Mindixo digital bookstore."),component:()=> <StoreContent field="privacy" title="Privacy Policy"/>});
