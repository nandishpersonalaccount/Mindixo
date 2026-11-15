import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/lordshivstoremanage")({
  beforeLoad: () => {
    throw redirect({ to: "/lordshivstoremanagenment" });
  },
});
