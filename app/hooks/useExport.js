import { usePathname } from 'next/navigation'

const useExport = () => {
    const path = usePathname()
    const isExport = path.includes('/export-campaign-setup') ? true : false
    return isExport
}

export default useExport