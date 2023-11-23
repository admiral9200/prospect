'use client'
import { useParams } from 'next/navigation';

const useLangParam = () => {
    const { lang } = useParams()
    return lang ? '/' + lang : ''
}

export default useLangParam