import type { Metadata } from "next";
import SubmitForm from "./SubmitForm";

export const metadata: Metadata = {
  title: "Submit Your Business | The Marco Passport",
  description:
    "Submit your business details and choose an advertising plan for The Marco Passport Magazine.",
};

export default function BusinessSubmitPage() {
  return <SubmitForm />;
}
