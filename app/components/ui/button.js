export function RoundButton({ title, isActive }) {
  {
    return isActive ? (
      <button
        type="submit"
        style={{ padding: "12px 16px" }}
        className={`rounded-md w-full text-white text-sm font-semibold shadow-sm bg-violet-700 hover:bg-violet-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2`}
      >
        {title}
      </button>
    ) : (
      <button
        type="submit"
        style={{
          padding: "12px 16px",
          border: "2px solid #E5E7EB",
          color: "#D1D5DB",
        }}
        className={`mt-4 rounded-full w-[200px] text-sm font-semibold shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-not-allowed`}
      >
        {title}
      </button>
    );
  }
}
