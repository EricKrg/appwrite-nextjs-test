export default function Protected(params:any) {
    return (<>
        <h1>Protected</h1>
    </>)
    
}


export async function getStaticProps(context: any) {
    return {
      props: {
        protected: true,
      },
    }
  }
  