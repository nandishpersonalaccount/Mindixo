import { createFileRoute } from "@tanstack/react-router";
import { Categories } from "@/components/site/Categories";
import { pageMeta } from "@/lib/meta";
export const Route=createFileRoute("/genres")({head:()=>pageMeta("Categories","Explore the Mindixo ebook collection by category."),component:Categories});
