import {createFileRoute} from "@tanstack/react-router";
import {StoreContent} from "@/components/site/StoreContent";
import {pageMeta} from "@/lib/meta";
export const Route=createFileRoute("/terms")({head:()=>pageMeta("Terms of Service","Terms of Service for the Mindixo digital bookstore."),component:()=> <StoreContent field="terms" title="Terms of Service"/>});
