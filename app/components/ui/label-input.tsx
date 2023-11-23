export default function InputWithLabel({ label, info, state, handler }: { label: string, info: string, state: any, handler: (e: any) => void }) {
   
  return (
    <div>
      <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <div>
        <input
          type="email"
          name="email"
          id="email"
          value={state}
          onChange={(e) => handler(e)}
          className={`w-full px-6 py-4 mt-2 font-semibold text-gray-900 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none`}   
          placeholder="name@company.com"
          aria-describedby="email-description"
        />
        </div>
        
        <small></small>
      {
        info && <p className="mt-2 text-sm text-gray-500" id="email-description">
        {info}
      </p>
      }
    </div>
  )
}