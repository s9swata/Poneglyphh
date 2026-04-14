import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <section className="py-24">
        <div className="container-max flex flex-col items-center gap-6 text-center max-w-lg mx-auto">
          <p className="text-sub font-medium uppercase tracking-widest text-grey-1">contact</p>
          <h1 className="text-[clamp(36px,5vw,52px)] font-medium leading-tight tracking-tight text-black">
            Let&apos;s talk
          </h1>
          <p className="text-body text-grey-1">
            Whether you want a demo, have a question, or just want to say hi — we&apos;re here.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-max grid grid-cols-1 md:grid-cols-2 gap-16 items-start max-w-4xl mx-auto">
          {/* Info */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-medium text-black">Get in touch</h2>
              <p className="text-body text-grey-1">
                Fill out the form and our team will get back to you within one business day.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: "Email", value: "hello@remote.com" },
                { label: "Office", value: "San Francisco, CA" },
                { label: "Response time", value: "Within 24 hours" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <p className="text-xs font-medium uppercase tracking-widest text-grey-1">
                    {item.label}
                  </p>
                  <p className="text-sm text-black">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "First name", name: "firstName", type: "text" },
                { label: "Last name", name: "lastName", type: "text" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-black" htmlFor={field.name}>
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    className="px-3 py-2.5 text-sm border border-grey-3 rounded-xl outline-none focus:border-grey-1 transition-colors bg-white"
                    placeholder={field.label}
                  />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-black" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="px-3 py-2.5 text-sm border border-grey-3 rounded-xl outline-none focus:border-grey-1 transition-colors bg-white"
                placeholder="you@company.com"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-black" htmlFor="company">
                Company
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className="px-3 py-2.5 text-sm border border-grey-3 rounded-xl outline-none focus:border-grey-1 transition-colors bg-white"
                placeholder="Your company"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-black" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="px-3 py-2.5 text-sm border border-grey-3 rounded-xl outline-none focus:border-grey-1 transition-colors bg-white resize-none"
                placeholder="Tell us how we can help..."
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-black font-medium rounded-xl hover:bg-primary/80 transition-colors"
            >
              Send message
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  );
}
