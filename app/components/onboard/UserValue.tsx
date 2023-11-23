export default function UserValue({ setPreposition, preposition }) {
    return (
      <div className='w-[400px]'>
        <h2 className='text-[24px] font-bold'>What is your value preposition?</h2>
        <input
          placeholder='I help businesses generate more revenues'
          className='mt-2 w-full h-12 rounded-md border-gray-200 border-[2px] text-black'
          value={preposition}
          onChange={e => setPreposition(e.target.value)}
        />
      </div>
    )
  }