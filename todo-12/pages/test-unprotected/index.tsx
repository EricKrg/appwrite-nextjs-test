export default function Unprotected(params:any) {
    return (<>
        <h1>UnProtected</h1>
    </>)
    
}


export async function getStaticProps(context: any) {
    return {
      props: {
        protected: false,
      },
    }
  }
  