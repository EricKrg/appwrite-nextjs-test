import type { NextPage } from 'next'
import Logout from '../components/Logout'
import Task from '../components/Task';
import TaskList from '../components/TaskList';
import { useUser } from '../components/user';

const Home: NextPage = (params: any) => {
  console.log("params", params);
  const userContext = useUser();

  return (<>
    <div className="h-full flex flex-col">
      <div className='flex flex-row items-center'>
        <h1 className="grow content-heading">Todo</h1>
        <div className="bg-slate-500 text-slate-50 rounded-3xl px-2 flex flex-row items-center h-6 dark:bg-slate-100 dark:text-slate-800">
          <span className=" text-sm text-right font-light mr-2">{userContext.user?.email}</span>
          <Logout />
        </div>
      </div>
      <div className="flex-col flex overflow-y-auto">
        <TaskList />
      </div>
      <div className='flex '>
        <Task id={undefined} task={""} taskState={false} />
      </div>
    </div>
  </>)
}

export async function getServerSideProps(context: any) {
  return {
    props: {
      protected: true,
    }
  };
}

export default Home
