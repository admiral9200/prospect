import { useEffect, useContext } from "react";
// import { GlobalContext } from '@/app/context/context'
import { GlobalContext } from '../context/context'

const useLocale = () => {
    const { state, dispatch } = useContext(GlobalContext)
    let locale;

    useEffect(() => {
        if (typeof window !== "undefined") {
            const lang = window.navigator.language.split('-')
            locale = lang[0]
            dispatch({
                type: 'LOCALE',
                payload: locale
            })
            // console.log(window.navigator.language);
        }
    }, []);
    return { locale: state.locale }
}

export default useLocale