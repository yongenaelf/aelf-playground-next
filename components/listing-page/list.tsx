import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import clsx from "clsx";

interface Item {
  id: string;
  img: string;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

export function List({ list }: { list: Item[] }) {

  if (list.length === 0) {
    return <p>No items for the current search / filter.</p>
  }

  return (
    <div className="grid grid-flow-row-dense grid-cols-2 lg:grid-cols-3 gap-8">
      {list.map((i) => (
        <Link key={i.id} to={i.link}>
          <Card className="flex flex-col h-full">
            <div className="overflow-hidden">
              <img
                alt="Image"
                width={300}
                height={300}
                className="h-auto w-full object-cover transition-all hover:scale-105"
                src={i.img}
              />
            </div>
            <CardHeader className="flex-grow">
              <CardTitle>{i.title}</CardTitle>
              <CardDescription>{i.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              {i.tags.map((tag, index) => (
                <span
                  key={tag}
                  className={clsx(
                    "inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10",
                    { "ml-3": index !== 0 }
                  )}
                >
                  {tag}
                </span>
              ))}
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
