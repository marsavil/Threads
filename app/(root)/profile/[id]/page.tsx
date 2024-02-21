import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsList, TabsContent, TabsTrigger  } from "@/components/ui/tabs";
import { profileTabs } from "@/constants";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import { redirect } from 'next/navigation';


async function Page({ params }: { params :{ id:string}}) {

  const user = await currentUser();
  if ( !user ) return null;
  const userDB = await fetchUser(params.id);
  if (!userDB) redirect('/sign-up');
  console.log(userDB)
  if ( !userDB.onboarded ) redirect( '/onboarding')
  
  return (
    <section>
      <ProfileHeader 
        accountId={userDB.id}
        authUserId={user.id}
        name={userDB.name}
        username={userDB.username}
        bio={userDB.bio}
        imgUrl={userDB.image}
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            { profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image
                src={tab.icon}
                alt={tab.label}
                width={24}
                height={24}
                className="object-contain"
                />
                <p className="max-sm:hidden">{tab.label}</p>
                {tab.label === 'Threads' && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userDB?.threads?.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
              <ThreadsTab 
                currentUserId={user.id}
                accountId={userDB.id}
                accountType='User'
              />
            </TabsContent>
          ))}

        </Tabs>
      </div>
    </section>
  )
}
export default Page