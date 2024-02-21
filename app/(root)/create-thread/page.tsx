import PostThread from "@/components/forms/PostThread";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from 'next/navigation';


async function Page() {

  const user = await currentUser();
  if ( !user ) return null;
  const userDB = await fetchUser(user.id);
  if ( !userDB.onboarded ) redirect( '/onboarding')
  
  return (
    <>
      <h1 className="head-text">Create Thread</h1>
      <PostThread userId={userDB._id}/>
    </>
  )
}
export default Page;