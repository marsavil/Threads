import Image from "next/image";
import Link from "next/link";

interface Props {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment: boolean;
}

const ThreadCard = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment
}: Props) => {
  return (
    <article className={isComment ? 'flex w-full flex-col rounded-xl py-5 xs:px-20' : 'flex w-full flex-col rounded-xl bg-dark-2 p-7'}
    >
      <div className="flex items-start justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt={"Profile Image"}
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>
          <div className="flex w-full flex-col">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="cursor-pointer text-base-semibold text-light-1">
                {author.name}
              </h4>
            </Link>
            <p className="mt-2 text-small-regular text-light-2">{content}</p>
            <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <Image
                  alt="Add to favourites list"
                  width={24}
                  height={24}
                  src="/assets/heart-gray.svg"
                  className="cursor-pointer object-contain"
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    alt="Write a reply to this thread"
                    width={24}
                    height={24}
                    src="/assets/reply.svg"
                    className="cursor-pointer object-contain"
                  />
                </Link>
                
                <Image
                  alt="Repost this thread"
                  width={24}
                  height={24}
                  src="/assets/repost.svg"
                  className="cursor-pointer object-contain"
                />
                <Image
                  alt="Share this post"
                  width={24}
                  height={24}
                  src="/assets/share.svg"
                  className="cursor-pointer object-contain"
                />
              </div>
              { isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 textt-subtle-medium text-gray-1">{comments.length} replies</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ThreadCard;
