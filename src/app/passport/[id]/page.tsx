import type { Metadata } from "next";
import { PassportDetailPage } from "@/features/passport/components/PassportDetailPage";

export const metadata: Metadata = {
  title: "Passport — The Marco Passport",
  robots: { index: false },
};

export default async function Passport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PassportDetailPage id={id} />;
}
