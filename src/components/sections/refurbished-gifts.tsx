import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";

interface Category {
  name: string;
  image: string | null;
  href: string;
}

const categories: Category[] = [
  {
    name: "Electronics",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a64ae1b9-c6d1-4006-a66f-8c60bf4420a7-ebay-com/assets/images/s-l500-2.webp",
    href: "/category/Electronics",
  },
  {
    name: "Home",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a64ae1b9-c6d1-4006-a66f-8c60bf4420a7-ebay-com/assets/images/s-l500-3.webp",
    href: "/category/Home",
  },
  {
    name: "Fashion",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a64ae1b9-c6d1-4006-a66f-8c60bf4420a7-ebay-com/assets/images/s-l500-4.webp",
    href: "/category/Fashion",
  },
  {
    name: "Sports",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a64ae1b9-c6d1-4006-a66f-8c60bf4420a7-ebay-com/assets/images/s-l500-5.webp",
    href: "/category/Sports",
  },
  {
    name: "Books",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a64ae1b9-c6d1-4006-a66f-8c60bf4420a7-ebay-com/assets/images/s-l500-6.webp",
    href: "/category/Books",
  },
  {
    name: "Tools",
    image: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/test-clones/a64ae1b9-c6d1-4006-a66f-8c60bf4420a7-ebay-com/assets/images/s-l500-7.webp",
    href: "/category/Tools",
  },
];

const RefurbishedGifts = () => {
  return (
    <section className="bg-background-primary py-12 md:py-16">
      <div className="container">
        <h2 className="font-display text-[32px] leading-[1.3] -tracking-[0.3px] font-bold text-text-primary text-center mb-8">
          Shop by Category
        </h2>
        <div className="flex flex-row flex-wrap justify-center items-start gap-y-8" style={{ gap: '24px' }}>
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex flex-col items-center text-center group w-[150px]"
            >
              <div className="w-[150px] h-[150px] bg-secondary rounded-full flex items-center justify-center transition-transform duration-200 ease-in-out group-hover:scale-105">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={110}
                    height={110}
                    className="object-contain"
                  />
                ) : (
                  <Camera className="w-14 h-14 text-muted-foreground" />
                )}
              </div>
              <p className="mt-4 text-sm font-bold text-text-primary leading-tight">
                {category.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RefurbishedGifts;