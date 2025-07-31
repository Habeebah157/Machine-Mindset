import type { FC } from "react";
import { Link } from "react-router-dom";

export interface INavbar {
	addition?: string;
}

export const Navbar: FC<INavbar> = ({ addition }) => (
	<div className="mx-auto py-5">
		<h1 className="text-center text-4xl font-bold">
			<Link to="/" className="cursor-pointer hover:underline">
				<h1 className="text-white">
					Machine Mindset
				</h1>
				
			</Link>
			{addition ? ` - ${addition}` : ""}
		</h1>
		<h2 className="text-center text-2xl text-white">
			A blog where I share my journey of learning and building
		</h2>
	</div>
);
