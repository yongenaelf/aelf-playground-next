"use client";

import { useShare } from "@/data/client";

export function SharePageComponent({ id }: { id: string }) {
  const { data, isLoading, error } = useShare(id);

  if (isLoading) return <p>Loading...</p>;
  else if (error) return <p>Error: {String(error)}</p>;

  return <p>{JSON.stringify(data)}</p>;
}
