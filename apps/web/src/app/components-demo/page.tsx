"use client"

import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@Poneglyph/ui/components/avatar"
import { Badge } from "@Poneglyph/ui/components/badge"
import { Button, buttonVariants } from "@Poneglyph/ui/components/button"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@Poneglyph/ui/components/card"
import { Checkbox } from "@Poneglyph/ui/components/checkbox"
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@Poneglyph/ui/components/field"
import { Input } from "@Poneglyph/ui/components/input"
import { Label } from "@Poneglyph/ui/components/label"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@Poneglyph/ui/components/pagination"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@Poneglyph/ui/components/select"
import { Separator } from "@Poneglyph/ui/components/separator"
import { Skeleton } from "@Poneglyph/ui/components/skeleton"
import { Spinner } from "@Poneglyph/ui/components/spinner"
import { Textarea } from "@Poneglyph/ui/components/textarea"

import { IconArrowRight, IconBell, IconCheck, IconPlus, IconSettings, IconUser } from "@tabler/icons-react"

export default function ComponentsDemo() {
  return (
    <div className="container mx-auto space-y-12 py-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Components Demo</h1>
        <p className="text-muted-foreground">A showcase of properly implemented shadcn/ui components</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Badge</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="ghost">Ghost</Badge>
          <Badge variant="link">Link</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge>
            <IconCheck data-icon="inline-start" />
            Default
          </Badge>
          <Badge variant="secondary">
            <IconCheck data-icon="inline-start" />
            Secondary
          </Badge>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="xs">Default</Button>
          <Button size="xs" variant="secondary">Secondary</Button>
          <Button size="xs" variant="outline">Outline</Button>
          <Button size="xs" variant="ghost">Ghost</Button>
          <Button size="xs" variant="destructive">Destructive</Button>
          <Button size="xs" variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="lg">Default</Button>
          <Button size="lg" variant="secondary">Secondary</Button>
          <Button size="lg" variant="outline">Outline</Button>
          <Button size="lg" variant="ghost">Ghost</Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="icon">
            <IconArrowRight />
          </Button>
          <Button size="icon" variant="secondary">
            <IconArrowRight />
          </Button>
          <Button size="icon" variant="outline">
            <IconArrowRight />
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="outline">Cancel</Button>
          <Button>
            Submit <IconArrowRight data-icon="inline-end" />
          </Button>
          <a href="#" className={buttonVariants()}>Link</a>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Card</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>This card uses the default size variant.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>The card component supports various sizes and configurations.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Action</Button>
            </CardFooter>
          </Card>

          <Card size="sm" className="w-full max-w-sm">
            <CardHeader>
              <CardTitle>Small Card</CardTitle>
              <CardDescription>This card uses the small size variant.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>A more compact appearance for less prominent use cases.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">Action</Button>
            </CardFooter>
          </Card>

          <Card className="w-full max-w-sm">
            <CardHeader className="border-b">
              <CardTitle>Header with Border</CardTitle>
              <CardDescription>This is a card with a header that has a bottom border.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>The header has a border-b class applied, creating visual separation.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Checkbox</h2>
        <div className="flex flex-col gap-4">
          <Field orientation="horizontal">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </Field>

          <Field orientation="horizontal">
            <Checkbox id="terms-2" defaultChecked />
            <FieldContent>
              <FieldLabel htmlFor="terms-2">Accept terms and conditions</FieldLabel>
              <FieldDescription>By clicking this checkbox, you agree to the terms and conditions.</FieldDescription>
            </FieldContent>
          </Field>

          <Field orientation="horizontal" data-invalid>
            <Checkbox id="terms-3" aria-invalid />
            <FieldLabel htmlFor="terms-3">Accept terms and conditions</FieldLabel>
          </Field>

          <Field orientation="horizontal">
            <Checkbox id="toggle" disabled />
            <FieldLabel htmlFor="toggle">Enable notifications</FieldLabel>
          </Field>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input</h2>
        <div className="flex flex-col gap-6 max-w-md">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="name@example.com" />
          </Field>

          <Field>
            <FieldLabel htmlFor="username">Username</FieldLabel>
            <Input id="username" type="text" placeholder="Enter your username" />
            <FieldDescription>Choose a unique username for your account.</FieldDescription>
          </Field>

          <Field data-invalid>
            <FieldLabel htmlFor="error">Error Input</FieldLabel>
            <Input id="error" type="text" placeholder="Error" aria-invalid="true" />
          </Field>

          <Field>
            <FieldLabel htmlFor="disabled">Disabled</FieldLabel>
            <Input id="disabled" type="email" placeholder="Email" disabled />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input id="password" type="password" placeholder="Password" />
          </Field>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Select</h2>
        <div className="flex flex-col gap-4 max-w-sm">
          <Select defaultValue="usd">
            <FieldLabel>Currency</FieldLabel>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="usd">USD</SelectItem>
                <SelectItem value="eur">EUR</SelectItem>
                <SelectItem value="gbp">GBP</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Label</h2>
        <div className="flex flex-col gap-4 max-w-sm">
          <Field>
            <Label htmlFor="username">Username</Label>
            <Input id="username" placeholder="Username" />
          </Field>

          <Field orientation="horizontal">
            <Checkbox id="terms-label" />
            <Label htmlFor="terms-label">Accept terms and conditions</Label>
          </Field>

          <Field>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Message" />
          </Field>

          <Field data-disabled={true}>
            <Label htmlFor="disabled-label">Disabled</Label>
            <Input id="disabled-label" placeholder="Disabled" disabled />
          </Field>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Pagination</h2>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>2</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Skeleton</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="w-full">
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-square w-full" />
            </CardContent>
          </Card>

          <div className="flex w-full items-center gap-4">
            <Skeleton className="size-10 shrink-0 rounded-full" />
            <div className="grid gap-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Sonner (Toast)</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast("Event has been created")}>
            Show Toast
          </Button>
          <Button variant="outline" onClick={() => toast("Event has been created", { description: "Monday, January 3rd at 6:00pm" })}>
            Show with Description
          </Button>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Avatar</h2>
        <div className="flex flex-wrap gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback className="bg-primary text-primary-foreground">AB</AvatarFallback>
          </Avatar>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Spinner</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Spinner />
          <Spinner data-icon="inline-start" />
          <Button>
            <Spinner data-icon="inline-start" />
            Loading
          </Button>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Textarea</h2>
        <div className="max-w-sm">
          <Field>
            <Label htmlFor="textarea">Message</Label>
            <Textarea id="textarea" placeholder="Type your message here." />
          </Field>
        </div>
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Form Example</h2>
        <Card className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>Enter your email below to login to your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="login-email">Email</FieldLabel>
                  <Input id="login-email" type="email" placeholder="m@example.com" required />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="login-password">Password</FieldLabel>
                    <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">Forgot your password?</a>
                  </div>
                  <Input id="login-password" type="password" required />
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button type="submit" className="w-full">Login</Button>
            <Button variant="outline" className="w-full">Login with Google</Button>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="#" className="underline underline-offset-4">Sign up</a>
            </div>
          </CardFooter>
        </Card>
      </section>
    </div>
  )
}
