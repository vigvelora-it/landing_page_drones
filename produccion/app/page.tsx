import { V4Interactions } from "@/components/v4-interactions";
import { getV4Template } from "@/lib/v4-template";

export const dynamic = "force-static";

export default function Home() {
  const template = getV4Template();

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: template.css }} />
      <main dangerouslySetInnerHTML={{ __html: template.body }} />
      <V4Interactions />
    </>
  );
}
