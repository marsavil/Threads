import { fetchUser, fetchUsers, getActivity } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";


async function Page({ params }: { params :{ id:string}}) {

  const user = await currentUser();
  if ( !user ) return null;
  const userDB = await fetchUser(user.id);
  if ( !userDB?.onboarded ) redirect( '/onboarding')
  
  // get activiy
  const activities = await getActivity(userDB._id)
    
  

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {activities.length>0? (
          <>
            {activities.map((activity) => (
              <Link
                key={activity._id}
                href={`/thread/${activity.parentId}`}
                >
                  <article className="activity-card">
                    <Image
                      src={activity.author.image}
                      alt="Profile picture"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-light-1">
                      <span className="mr-1 text-primary-500">
                        {activity.author.name}
                      </span>{" "}
                      replied to your thread
                    </p>
                  </article>
                </Link>
            ))}
          </>
        ) : ( <p className="!text-base-regular text-light-3">No new activity</p>)}
      </section>
    </section>
  )
}
export default Page;