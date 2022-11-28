import React from 'react'

export default function Unprotected (params: any): JSX.Element {
  return (<>
        <h1>UnProtected</h1>
    </>)
}

export async function getStaticProps (context: any): Promise<any> {
  return {
    props: {
      protected: false
    }
  }
}
