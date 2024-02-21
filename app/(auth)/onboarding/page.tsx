
import AccountProfile from "@/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await currentUser();
  const userDB = await fetchUser(user.id);
  const userData = {
    id: user?.id,
    objectId: userDB?._id,
    username: userDB?.username || user?.username,
    name: userDB?.name || user?.firstName || '',
    bio: userDB?.bio || '',
    image: userDB?.image ||user?.imageUrl
  };
  if (userDB?.onboarded ) redirect( '/')

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">Complete your profile now to use Threads</p>
      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile 
          user={ userData }
          btnTitle='Continue'
        />
      </section>
    </main>
  );
}
