import type { FC } from "react";
import { Link } from "react-router-dom";

export interface INavbar {
	addition?: string;
}

export const Navbar: FC<INavbar> = ({ addition }) => (
	<div className="mx-auto py-5">
		<h1 className="text-center text-4xl font-bold">
			<Link to="/" className="cursor-pointer hover:underline">
			<span
      className="text-5xl font-extrabold text-transparent bg-[linear-gradient(110deg,#ffffff_25%,#d1d5db_50%,#ffffff_75%)] bg-clip-text bg-[length:200%_100%] animate-shine"
    >
      {/* Mobile: plain text */}
      <span className="block md:hidden text-white">
        MACHINE MINDSET
      </span>

      {/* Medium+ screens: typing animation */}
      <span className="hidden md:inline typing">
        MACHINE MINDSET
      </span>
    </span>
  );





				
			</Link>
			{addition ? ` - ${addition}` : ""}
		</h1>
		<h2 className="text-center text-2xl text-white">
			A blog where I share my journey of learning and building
		</h2>
	</div>
);
