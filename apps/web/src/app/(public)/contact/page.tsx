"use client";
import { Button, Card, CardHeader, Input, Textarea } from "@ac/ui";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-16 dm-page-enter">
      <Card>
        <CardHeader title="Contact sales" description="We typically reply within one business day." />
        <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
          <Input label="Name" name="name" required />
          <Input label="Work email" name="email" type="email" required />
          <Textarea label="How can we help?" name="message" rows={5} />
          <Button type="submit" variant="primary">Send message</Button>
        </form>
      </Card>
    </div>
  );
}
