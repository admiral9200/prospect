import Image from 'next/image';

export default function Steps() {
  return (
    <section className="mb-32 mt-4 flex justify-center lg:px-48">
      <div className="mx-auto hidden max-w-screen-xl justify-center px-12 sm:flex sm:w-full">
        <Image
          src="/images/stepsdesktop.svg"
          alt="Steps"
          layout="responsive"
          width={1440}
          height={720}
        />
      </div>
      <div className="mx-auto flex w-full max-w-screen-sm justify-center p-8 sm:hidden">
        <Image
          src="/images/stepsmobile.svg"
          alt="Steps"
          layout="responsive"
          width={720}
          height={360}
        />
      </div>
    </section>
  );
}
