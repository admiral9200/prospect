import { DiscordLink } from "@/components/landing/DiscordLink";
import { CircleBackground } from "@/components/landing/CircleBackground";
import { Container } from "@/components/landing/Container";

export function CallToAction() {
  return (
    <section
      id="get-free-shares-today"
      className="relative overflow-hidden bg-gray-900 py-20 sm:py-28"
    >
      <div className="absolute left-20 top-1/2 -translate-y-1/2 sm:left-1/2 sm:-translate-x-1/2">
        <CircleBackground color="#fff" className="animate-spin-slower" />
      </div>
      <Container className="relative">
        <div className="mx-auto max-w-md sm:text-center">
          <h2 className="text-3xl font-medium tracking-tight text-white sm:text-4xl">
            Join the community
          </h2>
          <p className="mt-4 text-lg text-gray-300">
            Join on us Discord to see how people are using Prosp and meet people
            that are interested in the power of AI.
          </p>
          <div className="mt-8 flex justify-center">
            <DiscordLink color="white" />
          </div>
        </div>
      </Container>
    </section>
  );
}
