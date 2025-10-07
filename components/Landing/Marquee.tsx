import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";
import { Highlighter } from "../magicui/highlighter";

const reviews = [
    {
        name: "Aarav Mehta",
        username: "cognizant",
        body: "VirtiLearn helped me transition from theory to real-world problem solving. This is the future of learning.",
        img: "data:image/png;base64,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",
    },
    {
        name: "Riya Sharma",
        username: "Uber",
        body: "The projects here are exactly what top companies want. I landed my first internship because of this.",
        img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAP8AAACUCAMAAABr5Q9hAAAAZlBMVEUAAAD///+Dg4MsLCzAwMD8/PxoaGjm5uZjY2OUlJQ5OTnFxcWHh4fr6+s+Pj5SUlLPz88bGxva2toiIiKqqqr19fWcnJxubm6xsbHg4OBNTU0zMzN5eXknJycICAhYWFgSEhJFRUWhV6frAAADeUlEQVR4nO3Z63KiMBgG4HCIyEGNIUAQLXD/N7nkwCFoZ5jubCvd9/lT5BPGFxKSUEIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+u0vIBk97OWO8zAmp1Eb1Ez/smxwib7Dee1Q7w4CQTG34P/HDvonOT9d7p/w+8iM/8v9eyI/8W/MHzfXT8+Sfl97a1vx5yU+DKL0/n6OVtarxMpj3SSGkP0ygspSxF4e8jY35Q29SZO5323quzRNJfYLrnaq/8T9P8XVb8t9bz1Hf5m820q2NfUVtS6Hj7z6/vfm0KKjdascv9sw2iqkmOl1Qm1Hh/Yr85qanIo4FO5m4tgVcTfw6jP1MMB23MGnHw06c8b33f5VKXEylCnVKbh51QtekqV19ru/6QX2wDUVWzSN456FhW/5iXgI/Sn0BhNpuVZsvyinfTV+A8EHG/OV3RPgr2/IfF7WrfqpF/bCpW79c3N4zHS+WPix85ztvbMovnGKnBjw67LuphwE/L2uxvusfJj/dwYuTLflp41Yz1QNSQkqqerhbU99PE/N3OU6+qy35Zbcqq/teX0iqH4x+tuCr00UXex3O6/O+ny+tf7h5zDPvNXqc28G725L/qRur4Kf7p/m9HeU/6vz5au/9v8l/UW15ns9awsmfrQ+q5/ZfyPhZsp/8Qfo8wBESOfnT1TDe2HFPrQvWq8HRXvITvX6r3X295+T3Aresxj01/sV2HHxlN/n1YE7diSpf5Q+daqKaf1HadnB6vbrZTf5cP8VOh8Uu4a3yu08A3WNq1Sf0wpgvZznJOFjuJr9pxcNtHDt5YOM7679sGiESHZrqVe5DH8qmp2d3GT7KYJj+7ii/uZ9qqXpLkr41i9h1fi889MMFym+2bF906X8PelHWPj5Il7Sl/qinizvK39vElKehfb9Bnfz6E2WiLKV918fH5mDffkWyLEVqXvfUerG4o/ykXU9kTqWTX9arOuunY0WxqnGzVt5TftK7LzHZoXfyV226LBdikaub+4s2vifaVX6SVyGdbqCfmPl/2tgOfifNfWoiVB4759g+npoHDY9jx9DXcQfrv1GeVCLlTGY3Ndnp+vP53AzP8Xz4e1YjQ3DzJeNMVM//A/oIzr5M07A8JvM6Qp+g+77fDwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/5Q8uwiof5jqbJAAAAABJRU5ErkJggg==",
    },
    {
        name: "Kabir Nair",
        username: "Infosys",
        body: "Finally, a platform that feels built for ambitious students in India. Practical, structured, and premium.",
        img: "data:image/png;base64,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",
    },

    {
        name: "Devansh Kapoor",
        username: "TCS",
        body: "The blend of projects, mentorship, and community is unbeatable. VirtiLearn redefines internships.",
        img: "data:image/jpeg;base64,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",
    },
    {
        name: "Meera Iyer",
        username: "Startup Founder",
        body: "If you’re serious about building a career or startup, this is where you should be. Pure value.",
        img: "https://avatar.vercel.sh/founder",
    },
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    return (
        <figure
            className={cn(
                "relative h-full w-72 cursor-pointer overflow-hidden rounded-2xl border p-5 shadow-md transition-all hover:scale-105",
                // light styles
                "border-gray-950/[.08] bg-gradient-to-br from-gray-50 via-white to-gray-100",
                // dark styles
                "dark:border-gray-50/[.08] dark:bg-gradient-to-br dark:from-neutral-900 dark:via-neutral-950 dark:to-black"
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <img className="rounded-full bg-white p-1" width="36" height="36" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-semibold dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium text-muted-foreground">{username}</p>
                </div>
            </div>
            <blockquote className="mt-3 text-sm italic leading-relaxed text-muted-foreground">
                “{body}”
            </blockquote>
        </figure>
    );
};

export function MarqueeDemo() {
    return (
        <section className="relative w-full py-16 ">
            {/* Title */}
            <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Trusted by <Highlighter action="highlight" color="#FF9800" >Students & Professionals</Highlighter>
                </h2>
                <p className="mt-2 text-lg text-muted-foreground">
                    From IITs to startups to global giants — VirtiLearn is where careers are built.
                </p>
            </div>

            {/* Marquee */}
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden ">
                <Marquee pauseOnHover className="[--duration:25s]">
                    {firstRow.map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>
                <Marquee reverse pauseOnHover className="[--duration:25s]">
                    {secondRow.map((review) => (
                        <ReviewCard key={review.username} {...review} />
                    ))}
                </Marquee>

                {/* Gradient edges */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
                <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background via-background/80 to-transparent"></div>
            </div>
        </section>
    );
}
