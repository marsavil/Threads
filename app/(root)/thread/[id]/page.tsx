import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect, usePathname } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {
  
  if ( !params.id ) return null;
  const user = await currentUser();
  if ( !user ) return null;
  const userDB = await fetchUser(user.id);
  if ( !userDB.onboarded) redirect( '/onboarding')
  const thread = await fetchThreadById(params.id);
  
  return (
    <section className="relative">
      <div>
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={user?.id || ""}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          isComment={false}
        />
      </div>
      <div className="mt-7">
        <Comment 
          threadId={thread.id}
          currentUserImg={userDB.image}
          currentUserId={JSON.stringify(userDB._id)}

        />
      </div>
      {thread.children.map((comment: any) => (
        <ThreadCard
          key={comment._id}
          id={comment._id}
          currentUserId={comment.author || ""}
          parentId={comment.parentId}
          content={comment.text}
          author={comment.author}
          community={comment.community}
          createdAt={comment.createdAt}
          comments={comment.children}
          isComment={true}
        />
      ))}
      <div>

      </div>
    </section>
  );
};
export default Page;
