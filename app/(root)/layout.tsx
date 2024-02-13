import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import '../globals.css';
import Topbar from '@/components/shared/Topbar';
import LeftSidebar from '@/components/shared/LetSidebar';
import RightSidebar from '@/components/shared/RightSidebar';
import Bottombar from '@/components/shared/Bottombar';


const inter = Inter({ subsets: [ "latin" ]})

export const metadata = {
  title: 'Threads',
  description: 'A Next.js 14 Meta threads Application'
}
export default function RootLayout ( { children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <Topbar />
          <main>
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-4xl">
                { children }
              </div>
            </section>
            <RightSidebar />
          </main>
          <Bottombar />
         
        </body>
      </html>
    </ClerkProvider>
  )
}
