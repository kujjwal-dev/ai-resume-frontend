import React from 'react'

const SummaryPreview = ({resumeInfo}) => {
  return (
    <p className='text-xs'>
       {resumeInfo?.summery}
    </p>
  )
}

export default SummaryPreview