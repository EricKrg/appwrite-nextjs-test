import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'
import { UserContext } from '../components/user'
import { AppwriteSerivce } from '../services/appwrite.service'
import { useRouter } from 'next/router'
import { Models } from 'appwrite'
import Layout from '../components/Layout'

// based on https://alexsidorenko.com/blog/next-js-protected-routes/

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState<Models.Preferences | null>(null)
  const router = useRouter();
  const appwrite = AppwriteSerivce.getInstance();
  useEffect(() => {
    /**
     * Here goes the logic of retrieving a user
     * from the backend and redirecting
     * an unauthorized user
     * to the login page
     */
    const fetchUser = async () => {
      const currentUser = await appwrite.getCurrentUser();
      console.log("Current user", currentUser);
      setUser(currentUser)
      if (currentUser === null && pageProps.protected) {
        router.push("/login");
      }
    }

    fetchUser();

  }, []);

  const userChange = async (change: any | null) => {
    console.log("user change!", change);
    if (change === null) {
      setUser(null);
    }
    const user = await appwrite.getCurrentUser()
    setUser(user);

  }

  if (pageProps.protected && !user) {
    return <span>Loading...</span>;
  }

  // user type base protection
  // if (
  //   pageProps.protected && user
  // ) {
  //   return <Layout>Sorry, you don't have access</Layout>;
  // }

  return (
    <Layout>
      <UserContext.Provider value={{ user, change: userChange }}>
        <Component {...pageProps} />
      </UserContext.Provider>
    </Layout>
  )
}

export default MyApp
