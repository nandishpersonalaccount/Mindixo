import { queryOptions } from "@tanstack/react-query";
import { getCatalog } from "./catalog.functions";
export const catalogOptions = queryOptions({ queryKey: ["catalog"], queryFn: () => getCatalog(), staleTime: 60000 });
