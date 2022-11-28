import React from 'react'

export default function Protected (params: any): JSX.Element {
  return (<>
        <h1>Protected</h1>
    </>)
}

export async function getStaticProps (context: any): Promise<any> {
  return {
    props: {
      protected: true
    }
  }
}
