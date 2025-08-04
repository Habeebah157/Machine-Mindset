import { FC } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, ExternalLink } from "react-feather";
import { Label } from "@components/PostCard/Label";
import { format } from "date-fns";

interface IPost {
  author: any;
  body: string;
  createdAt: string;
  labels: any[];
  bodyHTML: string;
  title: string;
  number: number;
}

// Use the same parseDateString function as in HomePage
function parseDateString(dateStr: string): Date | null {
  if (!dateStr) return null;

  const now = new Date();

  let match = dateStr.match(/Today at (\d{1,2}):(\d{2}) (AM|PM)/i);
  if (match) {
    let [, hourStr, minuteStr, ampm] = match;
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (ampm.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;

    return new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute
    );
  }

  match = dateStr.match(/Yesterday at (\d{1,2}):(\d{2}) (AM|PM)/i);
  if (match) {
    let [, hourStr, minuteStr, ampm] = match;
    let hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (ampm.toUpperCase() === "PM" && hour !== 12) hour += 12;
    if (ampm.toUpperCase() === "AM" && hour === 12) hour = 0;

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    return new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
      hour,
      minute
    );
  }

  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function calculate(text: string): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} minute${minutes > 1 ? "s" : ""} read`;
}

export const PostCard: FC<IPost> = ({
  author,
  body,
  createdAt,
  labels,
  bodyHTML,
  title,
  number,
}) => {
  const parts = bodyHTML.split(" ");
  const description = [];
  while (description.join(" ").length < 300) {
    if (parts.length === 0) break;
    description.push(parts.shift());
  }

  console.log("Raw createdAt:", createdAt);
  const parsedDate = parseDateString(createdAt);
  if (!parsedDate) console.error("Invalid date on post:", { title, createdAt });

  const displayDate = parsedDate ? format(parsedDate, "PPP") : createdAt;

  return (
    <div className="mb-7 roundedp-6 focus:outline-none lg:mr-7 lg:mb-0 my-5 w-full m-3 border-white">
      <div className="flex items-center border-bpb-6">
        <div className="flex w-full items-start justify-between">
          <div className="w-full pl-3">
            <Link
              to={`/posts/${number}`}
              className="cursor-pointer text-xl font-medium leading-5 text-gray-800 hover:underline focus:outline-none"
            >
              <h1 className="text-white">{title}</h1>
            </Link>
            <p className="flex items-center pt-2 text-sm leading-normal text-gray-500 focus:outline-none">
              <Calendar className="mr-1 h-4 w-4" /> {displayDate} -{" "}
              <Clock className="mx-1 h-4 w-4" /> {calculate(body)}
            </p>
          </div>
          <div>
            <Link
              to={`/posts/${number}`}
              target="_blank"
              className="cursor-pointer text-blue-500 hover:text-blue-600"
            >
              <ExternalLink />
            </Link>
          </div>
        </div>
      </div>
      <div>
        <div className="flex flex-wrap focus:outline-none">
          {labels.map((label, idx) => (
            <Label
              {...{
                key: idx,
                ...label,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
